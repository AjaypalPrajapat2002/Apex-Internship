// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const siteNav = document.querySelector('.site-nav');

// Mobile Navigation
if (mobileMenuToggle && siteNav) {
  mobileMenuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Quiz Functionality
class Quiz {
  constructor() {
    this.questions = [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
      },
      {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2
      },
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
        correct: 2
      },
      {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1
      },
      {
        question: "What is the purpose of the 'alt' attribute in an image tag?",
        options: ["To make the image load faster", "To provide alternative text for accessibility", "To change the image size", "To add a border to the image"],
        correct: 1
      }
    ];
    
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    
    this.elements = {
      questionText: document.querySelector('.question-text'),
      optionsContainer: document.querySelector('.options-container'),
      currentQuestionSpan: document.querySelector('.current-question'),
      totalQuestionsSpan: document.querySelector('.total-questions'),
      scoreDisplay: document.querySelector('.score-display'),
      prevBtn: document.getElementById('prevBtn'),
      nextBtn: document.getElementById('nextBtn'),
      submitBtn: document.getElementById('submitBtn'),
      quizContent: document.querySelector('.quiz-content'),
      quizResults: document.querySelector('.quiz-results'),
      finalScore: document.querySelector('.final-score'),
      totalScore: document.querySelector('.total-score'),
      performanceMessage: document.querySelector('.performance-message'),
      restartBtn: document.getElementById('restartQuiz')
    };
    
    this.init();
  }
  
  init() {
    this.elements.totalQuestionsSpan.textContent = this.questions.length;
    this.renderQuestion();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.elements.prevBtn.addEventListener('click', () => this.previousQuestion());
    this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.elements.submitBtn.addEventListener('click', () => this.submitQuiz());
    this.elements.restartBtn.addEventListener('click', () => this.restartQuiz());
  }
  
  renderQuestion() {
    const question = this.questions[this.currentQuestion];
    this.elements.questionText.textContent = question.question;
    this.elements.currentQuestionSpan.textContent = this.currentQuestion + 1;
    
    // Clear previous options
    this.elements.optionsContainer.innerHTML = '';
    
    // Create option elements
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option';
      optionElement.textContent = option;
      
      // Check if this option was previously selected
      if (this.userAnswers[this.currentQuestion] === index) {
        optionElement.classList.add('selected');
      }
      
      optionElement.addEventListener('click', () => this.selectOption(index));
      this.elements.optionsContainer.appendChild(optionElement);
    });
    
    this.updateNavigationButtons();
  }
  
  selectOption(optionIndex) {
    // Remove previous selection
    this.elements.optionsContainer.querySelectorAll('.option').forEach(option => {
      option.classList.remove('selected');
    });
    
    // Select new option
    this.elements.optionsContainer.children[optionIndex].classList.add('selected');
    this.userAnswers[this.currentQuestion] = optionIndex;
    
    // Enable next button if we have an answer
    this.elements.nextBtn.disabled = false;
  }
  
  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.renderQuestion();
    }
  }
  
  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.renderQuestion();
    }
  }
  
  updateNavigationButtons() {
    this.elements.prevBtn.disabled = this.currentQuestion === 0;
    
    if (this.currentQuestion === this.questions.length - 1) {
      this.elements.nextBtn.style.display = 'none';
      this.elements.submitBtn.style.display = 'inline-flex';
    } else {
      this.elements.nextBtn.style.display = 'inline-flex';
      this.elements.submitBtn.style.display = 'none';
    }
    
    // Enable next button if user has answered current question
    this.elements.nextBtn.disabled = this.userAnswers[this.currentQuestion] === null;
  }
  
  submitQuiz() {
    this.calculateScore();
    this.showResults();
  }
  
  calculateScore() {
    this.score = 0;
    this.userAnswers.forEach((answer, index) => {
      if (answer === this.questions[index].correct) {
        this.score++;
      }
    });
  }
  
  showResults() {
    this.elements.quizContent.style.display = 'none';
    this.elements.quizResults.style.display = 'block';
    this.elements.finalScore.textContent = this.score;
    this.elements.totalScore.textContent = this.questions.length;
    
    // Performance message
    const percentage = (this.score / this.questions.length) * 100;
    let message = '';
    
    if (percentage >= 80) {
      message = 'Excellent! You have a great understanding of web development!';
    } else if (percentage >= 60) {
      message = 'Good job! You have a solid foundation in web development.';
    } else if (percentage >= 40) {
      message = 'Not bad! Keep learning and practicing.';
    } else {
      message = 'Keep studying! Web development takes time to master.';
    }
    
    this.elements.performanceMessage.textContent = message;
  }
  
  restartQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    
    this.elements.quizContent.style.display = 'block';
    this.elements.quizResults.style.display = 'none';
    this.elements.scoreDisplay.textContent = '0';
    
    this.renderQuestion();
  }
}

// Weather API Functionality
class WeatherApp {
  constructor() {
    this.apiKey = 'YOUR_API_KEY'; // Replace with actual API key
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    
    this.elements = {
      cityInput: document.getElementById('cityInput'),
      searchBtn: document.getElementById('searchWeather'),
      weatherDisplay: document.querySelector('.weather-display'),
      weatherError: document.querySelector('.weather-error'),
      weatherLoading: document.querySelector('.weather-loading'),
      cityName: document.querySelector('.city-name'),
      weatherDate: document.querySelector('.weather-date'),
      weatherIcon: document.getElementById('weatherIcon'),
      temperature: document.getElementById('temperature'),
      weatherDescription: document.getElementById('weatherDescription'),
      humidity: document.getElementById('humidity'),
      windSpeed: document.getElementById('windSpeed'),
      pressure: document.getElementById('pressure')
    };
    
    this.init();
  }
  
  init() {
    this.elements.searchBtn.addEventListener('click', () => this.getWeather());
    this.elements.cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.getWeather();
      }
    });
  }
  
  async getWeather() {
    const city = this.elements.cityInput.value.trim();
    
    if (!city) {
      this.showError('Please enter a city name');
      return;
    }
    
    this.showLoading();
    
    try {
      // For demo purposes, we'll use a mock API response
      // In a real application, you would use the actual OpenWeatherMap API
      const weatherData = await this.fetchWeatherData(city);
      this.displayWeather(weatherData);
    } catch (error) {
      this.showError('Unable to fetch weather data. Please try again.');
    }
  }
  
  async fetchWeatherData(city) {
    // Mock API response for demonstration
    // In a real application, replace this with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          name: city,
          main: {
            temp: Math.floor(Math.random() * 30) + 10, // Random temperature between 10-40°C
            humidity: Math.floor(Math.random() * 40) + 40, // Random humidity between 40-80%
            pressure: Math.floor(Math.random() * 200) + 1000 // Random pressure between 1000-1200 hPa
          },
          weather: [
            {
              description: ['sunny', 'cloudy', 'rainy', 'partly cloudy'][Math.floor(Math.random() * 4)],
              icon: '01d'
            }
          ],
          wind: {
            speed: Math.floor(Math.random() * 10) + 1 // Random wind speed between 1-10 m/s
          }
        };
        resolve(mockData);
      }, 1000);
    });
    
    // Real API call would look like this:
    // const response = await fetch(`${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`);
    // if (!response.ok) throw new Error('City not found');
    // return await response.json();
  }
  
  displayWeather(data) {
    this.hideLoading();
    this.hideError();
    
    this.elements.cityName.textContent = data.name;
    this.elements.weatherDate.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    this.elements.temperature.textContent = Math.round(data.main.temp);
    this.elements.weatherDescription.textContent = data.weather[0].description;
    this.elements.humidity.textContent = `${data.main.humidity}%`;
    this.elements.windSpeed.textContent = `${data.wind.speed} m/s`;
    this.elements.pressure.textContent = `${data.main.pressure} hPa`;
    
    // Set weather icon (using a placeholder for demo)
    this.elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    this.elements.weatherIcon.alt = data.weather[0].description;
    
    this.elements.weatherDisplay.style.display = 'block';
    this.elements.weatherDisplay.classList.add('fade-in');
  }
  
  showLoading() {
    this.hideError();
    this.elements.weatherDisplay.style.display = 'none';
    this.elements.weatherLoading.style.display = 'block';
  }
  
  hideLoading() {
    this.elements.weatherLoading.style.display = 'none';
  }
  
  showError(message) {
    this.hideLoading();
    this.elements.weatherDisplay.style.display = 'none';
    this.elements.weatherError.style.display = 'block';
    this.elements.weatherError.querySelector('p').textContent = message;
  }
  
  hideError() {
    this.elements.weatherError.style.display = 'none';
  }
}

// Image Carousel Functionality
class ImageCarousel {
  constructor() {
    this.images = [
      {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        title: 'Mountain Landscape',
        description: 'Beautiful mountain scenery with snow-capped peaks'
      },
      {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        title: 'Forest Path',
        description: 'Peaceful forest trail surrounded by tall trees'
      },
      {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        title: 'Ocean Waves',
        description: 'Crystal clear ocean waves crashing on the shore'
      },
      {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        title: 'City Skyline',
        description: 'Modern city skyline at sunset'
      },
      {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        title: 'Desert Dunes',
        description: 'Rolling sand dunes in the golden desert'
      }
    ];
    
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    
    this.elements = {
      track: document.querySelector('.carousel-track'),
      prevBtn: document.querySelector('.prev-btn'),
      nextBtn: document.querySelector('.next-btn'),
      indicators: document.querySelector('.carousel-indicators'),
      imageTitle: document.querySelector('.image-title'),
      imageDescription: document.querySelector('.image-description')
    };
    
    this.init();
  }
  
  init() {
    this.renderImages();
    this.renderIndicators();
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoPlay();
  }
  
  renderImages() {
    this.elements.track.innerHTML = '';
    
    this.images.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.title;
      img.loading = 'lazy';
      
      slide.appendChild(img);
      this.elements.track.appendChild(slide);
    });
  }
  
  renderIndicators() {
    this.elements.indicators.innerHTML = '';
    
    this.images.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'indicator';
      indicator.addEventListener('click', () => this.goToSlide(index));
      this.elements.indicators.appendChild(indicator);
    });
  }
  
  setupEventListeners() {
    this.elements.prevBtn.addEventListener('click', () => this.previousSlide());
    this.elements.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Pause autoplay on hover
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    carouselWrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
    carouselWrapper.addEventListener('mouseleave', () => this.startAutoPlay());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  }
  
  updateCarousel() {
    const translateX = -this.currentIndex * 100;
    this.elements.track.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    this.elements.indicators.querySelectorAll('.indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update navigation buttons
    this.elements.prevBtn.disabled = this.currentIndex === 0;
    this.elements.nextBtn.disabled = this.currentIndex === this.images.length - 1;
    
    // Update image info
    const currentImage = this.images[this.currentIndex];
    this.elements.imageTitle.textContent = currentImage.title;
    this.elements.imageDescription.textContent = currentImage.description;
  }
  
  nextSlide() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }
  
  previousSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (this.currentIndex === this.images.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.updateCarousel();
    }, 5000); // Change slide every 5 seconds
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add fade-in animation to cards
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => observer.observe(card));
  
  // Initialize components
  new Quiz();
  new WeatherApp();
  new ImageCarousel();
  
  // Add smooth scrolling behavior
  document.documentElement.style.scrollBehavior = 'smooth';
});

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize for responsive design
window.addEventListener('resize', debounce(() => {
  // Recalculate any layout-dependent elements if needed
  console.log('Window resized');
}, 250));

// Add loading states and error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
  });
} 