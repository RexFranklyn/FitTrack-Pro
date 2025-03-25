// DOM Elements
const dashboardBtn = document.getElementById('dashboardBtn');
const workoutsBtn = document.getElementById('workoutsBtn');
const goalsBtn = document.getElementById('goalsBtn');
const dashboardTab = document.getElementById('dashboardTab');
const workoutsTab = document.getElementById('workoutsTab');
const goalsTab = document.getElementById('goalsTab');
const logWorkoutBtn = document.getElementById('logWorkoutBtn');
const newWorkoutBtn = document.getElementById('newWorkoutBtn');
const workoutModal = document.getElementById('workoutModal');
const closeWorkoutModalBtn = document.getElementById('closeWorkoutModal');
const workoutForm = document.getElementById('workoutForm');
const newGoalBtn = document.getElementById('newGoalBtn');
const createGoalBtn = document.getElementById('createGoalBtn');
const goalModal = document.getElementById('goalModal');
const closeGoalModalBtn = document.getElementById('closeGoalModal');
const goalForm = document.getElementById('goalForm');
const notification = document.getElementById('notification');

// Sample data (normally this would be stored in a database or local storage)
let workouts = [];
let goals = [];
let activityChart;

// Initialize app
function initApp() {
    loadSampleData();
    setupEventListeners();
    updateDashboard();
    updateWorkoutsTab();
    updateGoalsTab();
    initCharts();
}

// Load sample data
function loadSampleData() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const fiveDaysAgo = new Date(now);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    workouts = [
        {
            id: 1,
            type: 'Cardio',
            date: now,
            duration: 45,
            calories: 420,
            notes: 'Morning run. Felt great!'
        },
        {
            id: 2,
            type: 'Strength',
            date: yesterday,
            duration: 60,
            calories: 350,
            notes: 'Upper body focus'
        },
        {
            id: 3,
            type: 'HIIT',
            date: twoDaysAgo,
            duration: 30,
            calories: 320,
            notes: 'High intensity interval training'
        },
        {
            id: 4,
            type: 'Cardio',
            date: threeDaysAgo,
            duration: 40,
            calories: 380,
            notes: 'Evening run'
        },
        {
            id: 5,
            type: 'Flexibility',
            date: fiveDaysAgo,
            duration: 25,
            calories: 120,
            notes: 'Yoga session'
        }
    ];
    
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    goals = [
        {
            id: 1,
            type: 'workouts',
            target: 20,
            deadline: nextMonth,
            notes: 'Complete 20 workouts by next month',
            current: 5
        },
        {
            id: 2,
            type: 'minutes',
            target: 1000,
            deadline: nextMonth,
            notes: 'Exercise for 1000 minutes',
            current: 200
        },
        {
            id: 3,
            type: 'calories',
            target: 10000,
            deadline: nextMonth,
            notes: 'Burn 10,000 calories',
            current: 1590
        }
    ];
}

// Set up event listeners
function setupEventListeners() {
    // Tab navigation
    dashboardBtn.addEventListener('click', () => setActiveTab(dashboardBtn, dashboardTab));
    workoutsBtn.addEventListener('click', () => setActiveTab(workoutsBtn, workoutsTab));
    goalsBtn.addEventListener('click', () => setActiveTab(goalsBtn, goalsTab));
    
    // Workout modal
    logWorkoutBtn.addEventListener('click', openWorkoutModal);
    newWorkoutBtn.addEventListener('click', openWorkoutModal);
    closeWorkoutModalBtn.addEventListener('click', closeWorkoutModal);
    
    // Goal modal
    newGoalBtn.addEventListener('click', openGoalModal);
    createGoalBtn.addEventListener('click', () => {
        setActiveTab(goalsBtn, goalsTab);
        setTimeout(openGoalModal, 100);
    });
    closeGoalModalBtn.addEventListener('click', closeGoalModal);
    
    // Form submissions
    workoutForm.addEventListener('submit', handleWorkoutSubmit);
    goalForm.addEventListener('submit', handleGoalSubmit);
    
    // Initialize date fields with current date
    document.getElementById('workoutDate').valueAsDate = new Date();
    
    // Set goal deadline default to 1 month from now
    const defaultDeadline = new Date();
    defaultDeadline.setMonth(defaultDeadline.getMonth() + 1);
    document.getElementById('goalDeadline').valueAsDate = defaultDeadline;
}

// Set active tab
function setActiveTab(button, tabContent) {
    document.querySelectorAll('.nav-links button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    button.classList.add('active');
    tabContent.classList.add('active');
}

// Open workout modal
function openWorkoutModal() {
    workoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close workout modal
function closeWorkoutModal() {
    workoutModal.classList.remove('active');
    document.body.style.overflow = '';
    workoutForm.reset();
}

// Open goal modal
function openGoalModal() {
    goalModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close goal modal
function closeGoalModal() {
    goalModal.classList.remove('active');
    document.body.style.overflow = '';
    goalForm.reset();
}

// Handle workout form submission
function handleWorkoutSubmit(event) {
    event.preventDefault();
    
    const type = document.getElementById('workoutType').value;
    const date = new Date(document.getElementById('workoutDate').value);
    const duration = parseInt(document.getElementById('workoutDuration').value);
    
    // Add default values or get from form if available
    const calories = parseInt(document.getElementById('workoutCalories')?.value) || 
                     Math.round(duration * (type === 'Cardio' ? 10 : 8)); // Rough calorie estimate
    const notes = document.getElementById('workoutNotes')?.value || '';
    
    const newWorkout = {
        id: workouts.length + 1,
        type,
        date,
        duration,
        calories,
        notes
    };
    
    // Add to workouts array
    workouts.unshift(newWorkout);
    
    // Update data
    updateDashboard();
    updateWorkoutsTab();
    updateGoalsTab();
    updateCharts();
    
    // Close modal and show notification
    closeWorkoutModal();
    showNotification('Workout logged successfully!');
}

// Handle goal form submission
function handleGoalSubmit(event) {
    event.preventDefault();
    
    const type = document.getElementById('goalType').value;
    const target = parseInt(document.getElementById('goalTarget').value);
    const deadline = new Date(document.getElementById('goalDeadline').value);
    const notes = document.getElementById('goalNotes').value;
    
    // Calculate current progress based on workouts
    let current = 0;
    if (type === 'workouts') {
        current = workouts.length;
    } else if (type === 'minutes') {
        current = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    } else if (type === 'calories') {
        current = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    } else if (type === 'streak') {
        current = calculateStreak();
    }
    
    const newGoal = {
        id: goals.length + 1,
        type,
        target,
        deadline,
        notes,
        current
    };
    
    // Add to goals array
    goals.push(newGoal);
    
    // Update data
    updateDashboard();
    updateGoalsTab();
    
    // Close modal and show notification
    closeGoalModal();
    showNotification('New goal created!');
}

// Update dashboard content
function updateDashboard() {
    // Update weekly stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyWorkouts = workouts.filter(workout => workout.date >= weekStart);
    const weeklyMinutes = weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const weeklyCalories = weeklyWorkouts.reduce((sum, workout) => sum + workout.calories, 0);
    const weeklyStreak = calculateStreak();
    
    document.getElementById('weeklyWorkouts').textContent = weeklyWorkouts.length;
    document.getElementById('weeklyMinutes').textContent = weeklyMinutes;
    document.getElementById('weeklyCalories').textContent = weeklyCalories;
    document.getElementById('weeklyStreak').textContent = weeklyStreak;
    
    // Update goal progress
    const goalProgressContainer = document.getElementById('goalProgressContainer');
    
    if (goals.length === 0) {
        goalProgressContainer.innerHTML = `
            <p class="empty-state">You haven't set any goals yet. <button id="createGoalBtn" class="button">Create a Goal</button></p>
        `;
        document.getElementById('createGoalBtn').addEventListener('click', () => {
            setActiveTab(goalsBtn, goalsTab);
            setTimeout(openGoalModal, 100);
        });
    } else {
        let goalProgressHTML = '';
        
        goals.slice(0, 2).forEach(goal => {
            const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
            const goalType = getGoalTypeDisplay(goal.type);
            const deadline = goal.deadline.toLocaleDateString();
            
            goalProgressHTML += `
                <div class="progress-container">
                    <div style="display: flex; justify-content: space-between;">
                        <p><strong>${goalType}</strong> - ${goal.current} / ${goal.target}</p>
                        <p>Due: ${deadline}</p>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <p>${goal.notes}</p>
                </div>
            `;
        });
        
        if (goals.length > 2) {
            goalProgressHTML += `<p style="margin-top: 1rem; text-align: center;">And ${goals.length - 2} more goals</p>`;
        }
        
        goalProgressContainer.innerHTML = goalProgressHTML;
    }
    
    // Update recent workouts
    const recentWorkoutsList = document.getElementById('recentWorkoutsList');
    
    if (workouts.length === 0) {
        recentWorkoutsList.innerHTML = `<p class="empty-state">No workouts logged yet.</p>`;
    } else {
        recentWorkoutsList.innerHTML = '';
        
        workouts.slice(0, 3).forEach(workout => {
            const li = document.createElement('li');
            li.className = 'workout-item';
            li.innerHTML = `
                <div>
                    <strong>${workout.type}</strong>
                    <span class="badge">${workout.duration} min</span>
                    <p class="date">${workout.date.toLocaleDateString()}</p>
                </div>
                <div>
                    <span>${workout.calories} cal</span>
                </div>
            `;
            recentWorkoutsList.appendChild(li);
        });
    }
}

// Update workouts tab content
function updateWorkoutsTab() {
    const workoutHistoryList = document.getElementById('workoutHistoryList');
    
    if (workouts.length === 0) {
        workoutHistoryList.innerHTML = `<p class="empty-state">No workouts logged yet.</p>`;
    } else {
        workoutHistoryList.innerHTML = '';
        
        workouts.forEach(workout => {
            const li = document.createElement('li');
            li.className = 'workout-item';
            li.innerHTML = `
                <div>
                    <strong>${workout.type}</strong>
                    <span class="badge">${workout.duration} min</span>
                    <p class="date">${workout.date.toLocaleDateString()}</p>
                    ${workout.notes ? `<p>${workout.notes}</p>` : ''}
                </div>
                <div>
                    <span>${workout.calories} cal</span>
                    <button class="button danger delete-workout" data-id="${workout.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            workoutHistoryList.appendChild(li);
        });
        
        // Add delete event listeners
        document.querySelectorAll('.delete-workout').forEach(button => {
            button.addEventListener('click', (e) => {
                const workoutId = parseInt(e.currentTarget.dataset.id);
                deleteWorkout(workoutId);
            });
        });
    }
}

// Update goals tab content
function updateGoalsTab() {
    const goalsContainer = document.getElementById('goalsContainer');
    
    if (goals.length === 0) {
        goalsContainer.innerHTML = `<p class="empty-state">You haven't set any goals yet.</p>`;
    } else {
        goalsContainer.innerHTML = '';
        
        goals.forEach(goal => {
            const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
            const goalType = getGoalTypeDisplay(goal.type);
            
            const goalDiv = document.createElement('div');
            goalDiv.className = 'progress-container';
            goalDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3>${goalType}</h3>
                        <p>Target: ${goal.target} | Current: ${goal.current}</p>
                        <p class="date">Due: ${goal.deadline.toLocaleDateString()}</p>
                    </div>
                    <button class="button danger delete-goal" data-id="${goal.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <p>${goal.notes}</p>
            `;
            goalsContainer.appendChild(goalDiv);
        });
        
        // Add delete event listeners
        document.querySelectorAll('.delete-goal').forEach(button => {
            button.addEventListener('click', (e) => {
                const goalId = parseInt(e.currentTarget.dataset.id);
                deleteGoal(goalId);
            });
        });
    }
}

// Delete a workout
function deleteWorkout(id) {
    workouts = workouts.filter(workout => workout.id !== id);
    
    // Update all data
    updateDashboard();
    updateWorkoutsTab();
    updateGoalsTab();
    updateCharts();
    
    showNotification('Workout deleted');
}

// Delete a goal
function deleteGoal(id) {
    goals = goals.filter(goal => goal.id !== id);
    
    // Update data
    updateDashboard();
    updateGoalsTab();
    
    showNotification('Goal deleted');
}

// Helper to get display text for goal type
function getGoalTypeDisplay(type) {
    switch (type) {
        case 'workouts': return 'Complete Workouts';
        case 'minutes': return 'Total Minutes';
        case 'calories': return 'Calories Burned';
        case 'streak': return 'Day Streak';
        default: return type;
    }
}

// Calculate current streak
function calculateStreak() {
    if (workouts.length === 0) return 0;
    
    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort((a, b) => b.date - a.date);
    
    // Check if there's a workout today
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const latestWorkoutDate = new Date(sortedWorkouts[0].date);
    latestWorkoutDate.setHours(0, 0, 0, 0);
    
    if (latestWorkoutDate < now) {
        return 0; // No workout today, streak broken
    }
    
    // Count consecutive days
    let streak = 1;
    let currentDate = now;
    
    for (let i = 1; i < sortedWorkouts.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        prevDate.setHours(0, 0, 0, 0);
        
        const workoutDate = new Date(sortedWorkouts[i].date);
        workoutDate.setHours(0, 0, 0, 0);
        
        if (workoutDate.getTime() === prevDate.getTime()) {
            streak++;
            currentDate = prevDate;
        } else if (workoutDate.getTime() < prevDate.getTime()) {
            break; // Gap found, streak ends
        }
    }
    
    return streak;
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize charts
function initCharts() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    // Get last 7 days dates
    const dates = [];
    const workoutCounts = [];
    const workoutMinutes = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dayWorkouts = workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            workoutDate.setHours(0, 0, 0, 0);
            return workoutDate.getTime() === date.getTime();
        });
        
        const dayMinutes = dayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
        
        // Format date as short day name
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        dates.push(dayName);
        workoutCounts.push(dayWorkouts.length);
        workoutMinutes.push(dayMinutes);
    }
    
    // Create chart
    activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Workouts',
                    data: workoutCounts,
                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Minutes',
                    data: workoutMinutes,
                    type: 'line',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 2,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Number of Workouts'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Minutes'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Update charts with new data
function updateCharts() {
    // Get last 7 days dates
    const dates = [];
    const workoutCounts = [];
    const workoutMinutes = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dayWorkouts = workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            workoutDate.setHours(0, 0, 0, 0);
            return workoutDate.getTime() === date.getTime();
        });
        
        const dayMinutes = dayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
        
        // Format date as short day name
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        dates.push(dayName);
        workoutCounts.push(dayWorkouts.length);
        workoutMinutes.push(dayMinutes);
    }
    
    // Update chart data
    activityChart.data.labels = dates;
    activityChart.data.datasets[0].data = workoutCounts;
    activityChart.data.datasets[1].data = workoutMinutes;
    activityChart.update();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);