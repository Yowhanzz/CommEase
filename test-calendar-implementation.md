# Calendar Implementation Test Guide

## What I've Implemented

### 1. New Service Function - `getAllEvents()`
- **Location**: `CommEase-main/src/api/services.js`
- **Purpose**: Fetches all events regardless of user role for calendar display
- **Endpoint**: `GET /api/events?include=organizer,volunteers&all=true`

### 2. New Calendar Time Formatting Functions
- **`formatCalendarDateTime(date, time)`**: Combines date and time for calendar display
- **`formatEventForCalendar(event)`**: Transforms event data into vue-cal compatible format

### 3. Enhanced Calendar Components

#### Dashboard-Volunteers.vue
- Added `allEvents` data property for calendar events
- Added `calendarEvents` computed property that formats events for vue-cal
- Added `fetchAllEvents()` method
- Enhanced calendar with better configuration (time range, step, etc.)
- Added event click handling
- Added calendar-specific CSS styling

#### Dashboard-Organizers.vue
- Same enhancements as volunteers dashboard
- Maintains separate `events` for organizer-specific events
- Uses `allEvents` for calendar display

### 4. Calendar Features Added
- **Time Range**: 6 AM to 10 PM display
- **Time Steps**: 30-minute intervals
- **Event Styling**: Color-coded by status (pending, ongoing, completed, etc.)
- **Event Details**: Shows title, location, programs, and status
- **Click Handling**: Both date and event click events
- **Responsive Design**: Disabled year views for better mobile experience

## Testing the Implementation

### 1. Start the Development Servers
```bash
# Backend (Laravel)
cd CommEase-backend
php artisan serve

# Frontend (Vue.js)
cd CommEase-main
npm run dev
```

### 2. Test Calendar Functionality
1. Login as a volunteer or organizer
2. Click the calendar icon in the dashboard
3. Verify that events appear on the calendar
4. Check that events are color-coded by status
5. Click on events to see if selection works
6. Test different calendar views (month, week, day)

### 3. Expected Behavior
- **All events** should appear in the calendar regardless of user role
- **Events should be color-coded**:
  - Yellow: Pending
  - Blue: Upcoming  
  - Green: Ongoing
  - Gray: Completed
  - Red: Cancelled
- **Event details** should show in tooltips/content
- **Time formatting** should be consistent and readable

## Potential Issues & Solutions

### Issue 1: Backend doesn't support `all=true` parameter
**Solution**: The existing `/events` endpoint should work, but if it filters by user role, we may need to modify the backend.

### Issue 2: Date/Time formatting issues
**Solution**: The new formatting functions handle timezone conversion using dayjs with Asia/Manila timezone.

### Issue 3: Calendar events not displaying
**Solution**: Check browser console for errors and verify API responses.

## Files Modified
1. `CommEase-main/src/api/services.js` - Added getAllEvents and formatting functions
2. `CommEase-main/src/views/Dashboard-Volunteers.vue` - Enhanced calendar implementation
3. `CommEase-main/src/views/Dashboard-Organizers.vue` - Enhanced calendar implementation

## Key Benefits
1. **Unified Event Display**: All events visible in calendar regardless of user role
2. **Better Time Formatting**: Separate formatting for calendar vs. other components
3. **Enhanced UX**: Color-coding, better time ranges, event details
4. **Maintainable Code**: Separate formatting functions that don't affect existing code
5. **Responsive Design**: Better mobile and desktop experience
