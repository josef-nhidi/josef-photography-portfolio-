<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

/**
 * ImageService
 * Handles image processing (WebP conversion) and storage orchestration (Local vs Cloudinary).
 */
class ImageService
{
    /**
     * Process an image file and upload it to the configured storage.
     */
    public function upload(UploadedFile $file, string $folder = 'photos'): ?string
    {
        try {
            // Native GD Resizing & WebP Conversion (Only if GD extension exists)
            $imageString = file_get_contents($file->getRealPath());
            $image = null;
            
            if (function_exists('imagecreatefromstring')) {
                $image = @\imagecreatefromstring($imageString);
            }
            
            if ($image) {
                // Resize if needed (Targeting max 2500px for Platinum Performance)
                $width = imagesx($image);
                $height = imagesy($image);
                $maxDim = 2500;
                
                if ($width > $maxDim || $height > $maxDim) {
                    $ratio = $width / $height;
                    if ($ratio > 1) {
                        $newWidth = $maxDim;
                        $newHeight = $maxDim / $ratio;
                    } else {
                        $newHeight = $maxDim;
                        $newWidth = $maxDim * $ratio;
                    }
                    $resizedImage = \imagecreatetruecolor($newWidth, $newHeight);
                    
                    // Maintain transparency for some formats before conversion
                    \imagealphablending($resizedImage, false);
                    \imagesavealpha($resizedImage, true);
                    
                    \imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                    \imagedestroy($image);
                    $image = $resizedImage;
                }

                ob_start();
                \imagewebp($image, null, 85);
                $webpData = ob_get_clean();
                \imagedestroy($image);
            } else {
                $webpData = $imageString; // Fallback to raw if GD fails
            }

            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $apiKey = env('CLOUDINARY_API_KEY');
            $apiSecret = env('CLOUDINARY_API_SECRET');

            if ($cloudName && $apiKey && $apiSecret) {
                return $this->uploadToCloudinary($webpData, $cloudName, $apiKey, $apiSecret);
            }

            return $this->uploadToLocal($webpData, $folder);

        } catch (\Exception $e) {
            Log::error('ImageService Upload Error: ' . $e->getMessage());
            return null;
        }
    }

    protected function uploadToCloudinary($data, $cloudName, $apiKey, $apiSecret): ?string
    {
        $params = [
            'folder' => 'josef-photography',
            'timestamp' => time(),
        ];
        
        ksort($params);
        
        $signString = "";
        foreach ($params as $key => $val) {
            $signString .= "$key=$val&";
        }
        $signString = rtrim($signString, '&');
        $signature = sha1($signString . $apiSecret);
        
        $url = "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload";
        $postFields = array_merge($params, [
            'file' => 'data:image/webp;base64,' . base64_encode($data),
            'api_key' => $apiKey,
            'signature' => $signature,
        ]);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        $exec = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) return null;

        $response = json_decode($exec, true);
        return $response['secure_url'] ?? null;
    }

    protected function uploadToLocal($data, $folder): ?string
    {
        if (!Storage::disk('public')->exists($folder)) {
            Storage::disk('public')->makeDirectory($folder);
        }
        
        $filename = $folder . '/' . uniqid() . '.webp';
        Storage::disk('public')->put($filename, $data);
        
        return $filename;
    }
}
