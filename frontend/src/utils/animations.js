// Confetti Animation
export const triggerConfetti = () => {
  const colors = ['#3182ce', '#60a5fa', '#fbbf24', '#f59e0b', '#10b981'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
};

// Toast Notification
export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-size: 1.5rem;">${type === 'success' ? '✓' : '⚠'}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Form Validation
export const validateInput = (input, value) => {
  if (!value || value.trim() === '') {
    input.classList.add('invalid');
    input.classList.remove('valid');
    return false;
  } else {
    input.classList.add('valid');
    input.classList.remove('invalid');
    return true;
  }
};

// Progress Bar
export const showProgress = (container) => {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  progressContainer.innerHTML = '<div class="progress-bar"></div>';
  container.appendChild(progressContainer);
  return progressContainer;
};

export const hideProgress = (progressElement) => {
  if (progressElement) {
    progressElement.remove();
  }
};
