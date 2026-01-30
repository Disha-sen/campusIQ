// =====================================================
// Chart.js Configuration and Helpers
// Premium Dark Theme with Animations
// =====================================================

// Chart.js default configuration for dark theme
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    },
    plugins: {
        legend: {
            labels: { 
                color: '#94a3b8', 
                font: { family: 'Inter', weight: '500' },
                padding: 20,
                usePointStyle: true
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            displayColors: true,
            boxPadding: 6
        }
    },
    scales: {
        x: {
            ticks: { color: '#64748b', font: { family: 'Inter' } },
            grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false }
        },
        y: {
            ticks: { color: '#64748b', font: { family: 'Inter' } },
            grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false }
        }
    }
};

// Gradient color creator
function createGradient(ctx, colorStart, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// Color palettes - Enhanced
const colors = {
    primary: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
    success: ['#10b981', '#34d399', '#6ee7b7'],
    warning: ['#f59e0b', '#fbbf24', '#fcd34d'],
    danger: ['#ef4444', '#f87171', '#fca5a5'],
    mixed: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
};

// Chart creators
const Charts = {
    // Bar Chart - Enhanced with gradients
    createBar: (ctx, labels, data, label, color = colors.primary[0]) => {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: color,
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: color + 'dd'
                }]
            },
            options: {
                ...chartDefaults,
                plugins: {
                    ...chartDefaults.plugins,
                    title: { display: false }
                }
            }
        });
    },
    
    // Line Chart - Enhanced with fill and animations
    createLine: (ctx, labels, datasets) => {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets.map((ds, i) => ({
                    ...ds,
                    borderColor: ds.color || colors.mixed[i],
                    backgroundColor: (ds.color || colors.mixed[i]) + '15',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: ds.color || colors.mixed[i],
                    pointBorderColor: '#0a0f1a',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }))
            },
            options: {
                ...chartDefaults,
                interaction: { intersect: false, mode: 'index' }
            }
        });
    },
    
    // Pie/Doughnut Chart - Enhanced
    createPie: (ctx, labels, data, isDoughnut = true) => {
        return new Chart(ctx, {
            type: isDoughnut ? 'doughnut' : 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.mixed,
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', padding: 20, usePointStyle: true }
                    }
                }
            }
        });
    },
    
    // Horizontal Bar
    createHorizontalBar: (ctx, labels, data, label, color = colors.primary[0]) => {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: color,
                    borderRadius: 6
                }]
            },
            options: {
                ...chartDefaults,
                indexAxis: 'y'
            }
        });
    },
    
    // Scatter Chart for Correlation
    createScatter: (ctx, data, xLabel, yLabel) => {
        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: `${xLabel} vs ${yLabel}`,
                    data: data,
                    backgroundColor: colors.primary[0] + '80',
                    pointRadius: 6
                }]
            },
            options: {
                ...chartDefaults,
                scales: {
                    x: { ...chartDefaults.scales.x, title: { display: true, text: xLabel, color: '#94a3b8' } },
                    y: { ...chartDefaults.scales.y, title: { display: true, text: yLabel, color: '#94a3b8' } }
                }
            }
        });
    }
};

// Destroy existing chart before creating new one
function destroyChart(chartInstance) {
    if (chartInstance) {
        chartInstance.destroy();
    }
}

window.Charts = Charts;
window.chartColors = colors;
window.destroyChart = destroyChart;
