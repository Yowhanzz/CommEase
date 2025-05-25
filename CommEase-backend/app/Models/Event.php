<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_title',
        'barangay',
        'organizer_id',
        'programs',
        'date',
        'start_time',
        'end_time',
        'objective',
        'description',
        'things_needed',
        'status',
        'started_at',
        'ended_at'
    ];

    protected $casts = [
        'programs' => 'array',
        'things_needed' => 'array',
        'date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime'
    ];

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function volunteers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_volunteer', 'event_id', 'volunteer_id')
            ->withPivot(['things_brought', 'time_in', 'time_out', 'attendance_status', 'attendance_notes', 'attendance_marked_at'])
            ->withTimestamps();
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(EventFeedback::class);
    }

    public function suggestions(): HasMany
    {
        return $this->hasMany(Suggestion::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // Accessors
    public function getDurationAttribute(): string
    {
        if (!$this->started_at || !$this->ended_at) {
            return 'N/A';
        }
        return $this->started_at->diffForHumans($this->ended_at, true);
    }

    public function getRegisteredCountAttribute(): int
    {
        return $this->volunteers()->count();
    }

    public function getAttendedCountAttribute(): int
    {
        return $this->volunteers()
            ->wherePivot('attendance_status', 'present')
            ->count();
    }

    public function getAverageVolunteerTimeAttribute(): string
    {
        $volunteers = $this->volunteers()
            ->whereNotNull('time_in')
            ->whereNotNull('time_out')
            ->get();

        if ($volunteers->isEmpty()) {
            return 'N/A';
        }

        $totalMinutes = $volunteers->sum(function ($volunteer) {
            return $volunteer->pivot->time_in->diffInMinutes($volunteer->pivot->time_out);
        });

        $averageMinutes = $totalMinutes / $volunteers->count();
        return round($averageMinutes) . ' minutes';
    }
}
