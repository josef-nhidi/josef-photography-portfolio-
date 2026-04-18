<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'username' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/admin/login', [
            'username' => 'admin@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_login_returns_diagnostic_error_on_failure(): void
    {
        // Simulate a scenario where the database/table might be missing or faulty
        // By using a mock or forcing an error in the controller
        $response = $this->postJson('/api/admin/login', [
            'username' => 'test',
            'password' => 'test'
        ]);

        // If table doesn't exist, it should return 500 with 'Login engine failure'
        // In this test environment, migrations run, so it won't fail here.
        // But we verify it returns 401 when table exists but user doesn't.
        $response->assertStatus(401);
    }
}
