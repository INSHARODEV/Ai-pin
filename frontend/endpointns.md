# API Endpoints Documentation

## User Endpoints

```
POST   /api/v1/users/register
POST   /api/v1/users/login
POST   /api/v1/users/otp/send
POST   /api/v1/users/otp/verify
GET    /api/v1/users/:userId
PUT    /api/v1/users/:userId
DELETE /api/v1/users/:userId
```

## User Profile Endpoints

```
GET    /api/v1/profile/:userId
PUT    /api/v1/profile/:userId
GET    /api/v1/profile/:userId/stats
```

## Level Endpoints

```
POST   /api/v1/levels
GET    /api/v1/levels
GET    /api/v1/levels/:levelId
PUT    /api/v1/levels/:levelId
DELETE /api/v1/levels/:levelId
GET    /api/v1/levels/:levelId/habits
```

## Habit Endpoints

```
POST   /api/v1/habits
GET    /api/v1/habits
GET    /api/v1/habits/:habitId
PUT    /api/v1/habits/:habitId
DELETE /api/v1/habits/:habitId
GET    /api/v1/habits/search
```

## Habit_Level (User Habits) Endpoints

```
POST   /api/v1/user-habits
GET    /api/v1/user-habits/:userId
GET    /api/v1/user-habits/:userId/one
PUT    /api/v1/user-habits/:userId/:habitId
DELETE /api/v1/user-habits/:userId/:habitId
GET    /api/v1/user-habits/:userId/progress
POST   /api/v1/user-habits/:userId/level-up
```

## Daily Performance Endpoints

```
POST   /api/v1/daily-performance
GET    /api/v1/daily-performance/:userId
GET    /api/v1/daily-performance/:userId/today
GET    /api/v1/daily-performance/:userId/stats
PUT    /api/v1/daily-performance/:userId/:date
DELETE /api/v1/daily-performance/:userId/:date
```

## Utility Endpoints

```
GET    /api/v1/leaderboard
```