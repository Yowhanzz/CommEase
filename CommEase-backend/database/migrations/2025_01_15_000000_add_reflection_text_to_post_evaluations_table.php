<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('post_evaluations', function (Blueprint $table) {
            // Add reflection_text field for text-based reflections
            $table->text('reflection_text')->nullable()->after('recommendation_rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('post_evaluations', function (Blueprint $table) {
            $table->dropColumn('reflection_text');
        });
    }
};
