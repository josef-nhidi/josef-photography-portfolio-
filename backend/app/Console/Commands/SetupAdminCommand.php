<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SetupAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup:admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Interactively create or update the main admin user (Great for fresh deployments!)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("📸 Welcome to the Josef Photography Admin Setup");
        $this->line("This command will help you securely create your admin account.");
        $this->line("----------------------------------------------------------");

        // Ask for email
        $email = $this->ask('Enter your admin email address (or username)');
        
        if (empty($email)) {
            $this->error('Email/username cannot be empty.');
            return Command::FAILURE;
        }

        // Ask for name
        $name = $this->ask('Enter your full name', 'Josef Admin');

        // Ask for password securely
        $password = $this->secret('Enter a secure password');
        
        if (strlen($password) < 6) {
            $this->error('Password must be at least 6 characters.');
            return Command::FAILURE;
        }

        $confirmPassword = $this->secret('Confirm your password');

        if ($password !== $confirmPassword) {
            $this->error('Passwords do not match. Please try again.');
            return Command::FAILURE;
        }

        // Create or Update the User
        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
            ]
        );

        $this->info("\n✅ Success! Admin user has been configured.");
        $this->line("You can now log into your dashboard at: https://josefnhidi.me/admin");
        $this->line("Email/Username: " . $email);
        $this->line("Password: (hidden)");
        
        return Command::SUCCESS;
    }
}
