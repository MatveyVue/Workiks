<template>
  <div id="app">
    <!-- Прелоадер -->
    <div v-if="initialLoading" id="preloader">
      <div class="loader"></div>
    </div>

    <!-- Шапка -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1>💼 Jobs</h1>
        </div>
        <div class="header-right">
          <button @click="showCreateModal = true" class="add-btn">
            <span class="btn-text">+ Add Job</span>
            <span class="btn-icon">Add Job</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Поиск -->
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="🔍 Search jobs..." 
        class="search-input"
      >
    </div>

    <!-- Лента объявлений -->
    <div class="jobs-container">
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="filteredJobs.length === 0" class="empty">
        <p>{{ searchQuery ? 'No jobs found' : 'No jobs yet. Create first one!' }}</p>
      </div>
      
      <div v-else class="jobs-list">
        <div 
          v-for="job in filteredJobs" 
          :key="job.id" 
          @click="selectJob(job)"
          class="job-card"
        >
          <!-- Бейдж верифицированного автора -->
          <div v-if="job.isVerified" class="verified-badge" title="Verified employer">
            ✓
          </div>
          
          <!-- Кнопка поделиться -->
          <button 
            @click.stop="copyJobLink(job)" 
            class="share-btn"
            :title="copiedJobId === job.id ? 'Link copied!' : 'Copy link to this job'"
          >
            {{ copiedJobId === job.id ? '✓' : '🔗' }}
          </button>
          
          <div class="job-header">
            <div class="avatar" :class="{ 'verified': job.isVerified }">
              {{ getInitial(job.userName) }}
            </div>
            <div class="job-info">
              <h3>{{ job.title }}</h3>
              <div class="author-row">
                <span class="author">{{ job.userName }}</span>
                <span v-if="job.isVerified" class="verified-label">✓ Verified</span>
              </div>
              <p class="time">{{ formatTime(job.createdAt) }}</p>
            </div>
          </div>
          
          <p class="description">{{ getShortDescription(job.description) }}</p>
          
          <div v-if="job.tags && job.tags.length > 0" class="tags">
            <span v-for="tag in job.tags.slice(0, 3)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          
          <div class="job-footer">
            <div class="footer-left">
              <span v-if="job.budget" class="budget">{{ job.budget }}</span>
              <div class="stats">
                <div class="stat">
                  <span class="stat-icon">👁️</span>
                  <span class="stat-count">{{ job.views || 0 }}</span>
                </div>
                <div class="stat">
                  <button 
                    @click.stop="toggleLike(job)" 
                    class="like-btn"
                    :class="{ 'liked': isLiked(job.id) }"
                    :title="isLiked(job.id) ? 'Unlike' : 'Like'"
                  >
                    {{ isLiked(job.id) ? '❤️' : '🤍' }}
                  </button>
                  <span class="stat-count">{{ job.likes || 0 }}</span>
                </div>
              </div>
            </div>
            <button @click.stop="contact(job)" class="contact-btn">
              <span class="contact-text">Contact</span>
              <span class="contact-icon">✉️</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка просмотра -->
    <div v-if="selectedJob" class="modal" @click.self="selectedJob = null">
      <div class="modal-content">
        <button @click="selectedJob = null" class="close-btn">✕</button>
        
        <div class="modal-header">
          <div class="avatar-large" :class="{ 'verified': selectedJob.isVerified }">
            {{ getInitial(selectedJob.userName) }}
          </div>
          <div class="modal-job-info">
            <div class="modal-title-row">
              <h2>{{ selectedJob.title }}</h2>
              <button 
                @click="copyJobLink(selectedJob)" 
                class="modal-share-btn"
                :class="{ 'copied': copiedJobId === selectedJob.id }"
              >
                {{ copiedJobId === selectedJob.id ? '✓ Link Copied' : '🔗 Share' }}
              </button>
            </div>
            <div class="author-row">
              <p class="author">{{ selectedJob.userName }}</p>
              <span v-if="selectedJob.isVerified" class="verified-label-large">
                ✓ Verified Employer
              </span>
            </div>
            <p class="time">{{ formatFullDate(selectedJob.createdAt) }}</p>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="modal-section">
            <h3>Description</h3>
            <p>{{ selectedJob.description }}</p>
          </div>
          
          <div v-if="selectedJob.tags && selectedJob.tags.length > 0" class="modal-section">
            <h3>Skills & Tags</h3>
            <div class="tags">
              <span v-for="tag in selectedJob.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="modal-stats">
            <div class="stat-item">
              <span class="stat-label">Views</span>
              <span class="stat-value">{{ selectedJob.views || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Likes</span>
              <span class="stat-value">{{ selectedJob.likes || 0 }}</span>
            </div>
            <div class="stat-item">
              <button 
                @click="toggleLike(selectedJob)" 
                class="modal-like-btn"
                :class="{ 'liked': isLiked(selectedJob.id) }"
              >
                {{ isLiked(selectedJob.id) ? '❤️ Unlike' : '🤍 Like' }}
              </button>
            </div>
          </div>
          
          <div class="contact-section">
            <h3>Contact Information</h3>
            
            <div class="contact-options">
              <!-- Телеграм -->
              <div v-if="isTelegram(selectedJob.contactInfo)" class="contact-option">
                <div class="contact-label">
                  <span class="contact-icon">📱</span>
                  <span>Telegram</span>
                </div>
                <div class="contact-value">
                  <code>{{ selectedJob.contactInfo }}</code>
                  <button @click="contact(selectedJob)" class="contact-action-btn telegram">
                    Open in Telegram
                  </button>
                </div>
              </div>
              
              <!-- Email -->
              <div v-else-if="isEmail(selectedJob.contactInfo)" class="contact-option">
                <div class="contact-label">
                  <span class="contact-icon">✉️</span>
                  <span>Email</span>
                </div>
                <div class="contact-value">
                  <code>{{ selectedJob.contactInfo }}</code>
                  <button @click="contact(selectedJob)" class="contact-action-btn email">
                    Send Email
                  </button>
                </div>
              </div>
              
              <!-- Другой контакт -->
              <div v-else class="contact-option">
                <div class="contact-label">
                  <span class="contact-icon">📞</span>
                  <span>Contact</span>
                </div>
                <div class="contact-value">
                  <code>{{ selectedJob.contactInfo }}</code>
                  <button @click="copyContact(selectedJob.contactInfo)" class="contact-action-btn copy">
                    Copy Contact
                  </button>
                </div>
              </div>
            </div>
            
            <div class="contact-tips">
              <p class="tip">
                <strong>💡 Tip:</strong> Always verify the employer before making any payments.
              </p>
              <p v-if="selectedJob.isVerified" class="verified-tip">
                ✓ This employer is verified by our team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка создания -->
    <div v-if="showCreateModal" class="modal" @click.self="showCreateModal = false">
      <div class="modal-content">
        <button @click="showCreateModal = false" class="close-btn">✕</button>
        <h2 class="create-job">Create New Job</h2>
        
        <form @submit.prevent="createJob" class="create-form">
          <div class="form-group">
            <label class="form-label">Your Name *</label>
            <input 
              v-model="newJob.userName" 
              type="text" 
              placeholder="John Doe" 
              required
              class="form-input"
            >
            <div class="input-hint">
              <span v-if="isUserVerified(newJob.userName)" class="verified-hint">
                ✓ You are verified
              </span>
              <span v-else class="unverified-hint">
                Verification adds trust to your profile
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Contact Information *</label>
            <input 
              v-model="newJob.contactInfo" 
              type="text" 
              placeholder="@username or email@example.com" 
              required
              class="form-input"
            >
            <div class="input-hint">
              Use @username for Telegram or email address
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Job Title *</label>
            <input 
              v-model="newJob.title" 
              type="text" 
              placeholder="Frontend Developer" 
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea 
              v-model="newJob.description" 
              placeholder="Describe the job requirements, tasks, and expectations..." 
              required
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Budget (optional)</label>
            <input 
              v-model="newJob.budget" 
              type="text" 
              placeholder="$500-1000 or Negotiable" 
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Tags</label>
            <input 
              v-model="tagInput" 
              type="text" 
              placeholder="Type tag and press Enter" 
              @keydown.enter.prevent="addTag"
              class="form-input"
            >
          </div>
          
          <div v-if="newJob.tags.length > 0" class="selected-tags">
            <span v-for="tag in newJob.tags" :key="tag" class="selected-tag">
              {{ tag }} <button type="button" @click="removeTag(tag)">×</button>
            </span>
          </div>
          
          <div class="form-buttons">
            <button type="button" @click="showCreateModal = false" class="cancel-btn">Cancel</button>
            <button type="submit" :disabled="submitting" class="submit-btn">
              {{ submitting ? 'Publishing...' : 'Publish Job' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Уведомление -->
    <transition name="slide-up">
      <div v-if="notification.show" class="notification" :class="notification.type">
        <span class="notification-icon">
          {{ notification.type === 'success' ? '✓' : '⚠' }}
        </span>
        <span class="notification-text">{{ notification.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  doc,
  Timestamp,
  increment,
  query,
  where,
  serverTimestamp,
  orderBy
} from "firebase/firestore";

export default {
  name: 'App',
  data() {
    return {
      initialLoading: true,
      loading: false,
      submitting: false,
      jobs: [],
      showCreateModal: false,
      selectedJob: null,
      searchQuery: '',
      tagInput: '',
      copiedJobId: null,
      newJob: {
        userName: '',
        contactInfo: '',
        title: '',
        description: '',
        tags: [],
        budget: ''
      },
      likedJobs: JSON.parse(localStorage.getItem('likedJobs') || '[]'),
      verifiedUsers: new Map(),
      notification: {
        show: false,
        message: '',
        type: 'success'
      },
      db: null
    };
  },
  computed: {
    filteredJobs() {
      if (!this.searchQuery.trim()) return this.jobs;
      
      const query = this.searchQuery.toLowerCase();
      return this.jobs.filter(job => {
        return (
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.userName.toLowerCase().includes(query) ||
          (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      });
    }
  },
  methods: {
    async initializeFirebase() {
      try {
        const app = initializeApp({
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID
        });
        this.db = getFirestore(app);
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        this.showNotification('Failed to initialize Firebase', 'error');
      }
    },
    
    async loadVerifiedUsers() {
      try {
        if (!this.db) return;
        
        const usersRef = collection(this.db, 'verifiedUsers');
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        
        this.verifiedUsers.clear();
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const userName = data.userName?.toLowerCase();
          if (userName) {
            this.verifiedUsers.set(userName, {
              verifiedAt: data.verifiedAt?.toDate(),
              verifiedBy: data.verifiedBy || 'admin'
            });
          }
        });
      } catch (error) {
        console.error('Error loading verified users:', error);
      }
    },
    
    async loadJobs() {
      this.loading = true;
      try {
        if (!this.db) {
          await this.initializeFirebase();
        }
        
        // Загружаем верифицированных пользователей
        await this.loadVerifiedUsers();
        
        const jobsQuery = query(
          collection(this.db, 'jobs'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(jobsQuery);
        this.jobs = querySnapshot.docs.map(docSnapshot => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            userName: data.userName || '',
            contactInfo: data.contactInfo || '',
            title: data.title || '',
            description: data.description || '',
            tags: data.tags || [],
            budget: data.budget || '',
            likes: data.likes || 0,
            views: data.views || 0,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            isActive: data.isActive !== false,
            isVerified: this.isUserVerified(data.userName)
          };
        });
        
      } catch (error) {
        console.error('Error loading jobs from Firebase:', error);
        this.showNotification('Error loading jobs', 'error');
      } finally {
        this.loading = false;
        this.initialLoading = false;
      }
    },
    
    isUserVerified(userName) {
      if (!userName) return false;
      return this.verifiedUsers.has(userName.toLowerCase());
    },
    
    selectJob(job) {
      this.selectedJob = job;
      this.incrementViews(job.id);
    },
    
    async incrementViews(jobId) {
      try {
        if (!this.db) return;
        
        const jobRef = doc(this.db, 'jobs', jobId);
        await updateDoc(jobRef, {
          views: increment(1)
        });
        
        const job = this.jobs.find(j => j.id === jobId);
        if (job) job.views = (job.views || 0) + 1;
        if (this.selectedJob?.id === jobId) this.selectedJob.views++;
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    },
    
    isLiked(jobId) {
      return this.likedJobs.includes(jobId);
    },
    
    async toggleLike(job) {
      try {
        if (!this.db) return;
        
        const jobId = job.id;
        const wasLiked = this.isLiked(jobId);
        
        const jobRef = doc(this.db, 'jobs', jobId);
        await updateDoc(jobRef, {
          likes: increment(wasLiked ? -1 : 1)
        });
        
        if (wasLiked) {
          this.likedJobs = this.likedJobs.filter(id => id !== jobId);
        } else {
          this.likedJobs.push(jobId);
        }
        
        localStorage.setItem('likedJobs', JSON.stringify(this.likedJobs));
        
        // Обновляем счетчики
        const jobIndex = this.jobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
          this.jobs[jobIndex].likes = (this.jobs[jobIndex].likes || 0) + (wasLiked ? -1 : 1);
        }
        
        if (this.selectedJob?.id === jobId) {
          this.selectedJob.likes = (this.selectedJob.likes || 0) + (wasLiked ? -1 : 1);
        }
        
        this.showNotification(
          wasLiked ? 'Removed from likes' : 'Added to likes',
          'success'
        );
        
      } catch (error) {
        console.error('Error toggling like:', error);
        this.showNotification('Error updating likes', 'error');
      }
    },
    
    async copyJobLink(job) {
      const link = `${window.location.origin}${window.location.pathname}#job-${job.id}`;
      
      try {
        await navigator.clipboard.writeText(link);
        this.copiedJobId = job.id;
        this.showNotification('Link copied to clipboard!', 'success');
        
        setTimeout(() => {
          this.copiedJobId = null;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        this.showNotification('Failed to copy link', 'error');
      }
    },
    
    isTelegram(contact) {
      return contact && contact.trim().startsWith('@');
    },
    
    isEmail(contact) {
      return contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    },
    
    addTag() {
      const tag = this.tagInput.trim();
      if (tag && !this.newJob.tags.includes(tag)) {
        this.newJob.tags.push(tag);
        this.tagInput = '';
      }
    },
    
    removeTag(tag) {
      this.newJob.tags = this.newJob.tags.filter(t => t !== tag);
    },
    
    async createJob() {
      if (!this.newJob.userName.trim() || 
          !this.newJob.contactInfo.trim() || 
          !this.newJob.title.trim() || 
          !this.newJob.description.trim()) {
        this.showNotification('Please fill all required fields', 'error');
        return;
      }

      this.submitting = true;

      try {
        if (!this.db) {
          await this.initializeFirebase();
        }

        const isVerified = this.isUserVerified(this.newJob.userName);

        const jobData = {
          userName: this.newJob.userName.trim(),
          contactInfo: this.newJob.contactInfo.trim(),
          title: this.newJob.title.trim(),
          description: this.newJob.description.trim(),
          tags: this.newJob.tags,
          budget: this.newJob.budget.trim(),
          likes: 0,
          views: 0,
          createdAt: Timestamp.now(),
          isActive: true
        };

        const docRef = await addDoc(collection(this.db, 'jobs'), jobData);
        
        const newJob = {
          id: docRef.id,
          ...jobData,
          createdAt: new Date(),
          isVerified
        };
        
        this.jobs.unshift(newJob);
        
        this.newJob = {
          userName: '',
          contactInfo: '',
          title: '',
          description: '',
          tags: [],
          budget: ''
        };
        this.tagInput = '';
        
        this.showCreateModal = false;
        this.showNotification('Job created successfully!', 'success');
        
      } catch (error) {
        console.error('Error creating job:', error);
        this.showNotification('Error creating job', 'error');
      } finally {
        this.submitting = false;
      }
    },
    
    async copyContact(contactInfo) {
      try {
        await navigator.clipboard.writeText(contactInfo);
        this.showNotification('Contact copied to clipboard!', 'success');
      } catch (err) {
        console.error('Failed to copy:', err);
        this.showNotification('Failed to copy contact', 'error');
      }
    },
    
    contact(job) {
      if (!job.contactInfo) {
        this.showNotification('No contact information available', 'error');
        return;
      }
      
      if (this.isTelegram(job.contactInfo)) {
        const username = job.contactInfo.replace('@', '').trim();
        window.open(`https://t.me/${username}`, '_blank', 'noopener,noreferrer');
      } else if (this.isEmail(job.contactInfo)) {
        window.location.href = `mailto:${job.contactInfo}?subject=Job Application: ${job.title}`;
      } else {
        this.copyContact(job.contactInfo);
      }
    },
    
    formatTime(date) {
      if (!date) return '';
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    
    formatFullDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    getInitial(name) {
      if (!name || typeof name !== 'string') return '?';
      return name.charAt(0).toUpperCase();
    },
    
    getShortDescription(description) {
      if (!description || typeof description !== 'string') return '...';
      if (description.length <= 100) return description;
      return description.substring(0, 100) + '...';
    },
    
    showNotification(message, type = 'success') {
      this.notification = { show: true, message, type };
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    }
  },
  mounted() {
    this.initializeFirebase().then(async () => {
      await this.loadJobs();
      this.initialLoading = false;
    });
    
    const hash = window.location.hash;
    if (hash && hash.startsWith('#job-')) {
      const jobId = hash.replace('#job-', '');
      setTimeout(async () => {
        await this.loadJobs();
        const job = this.jobs.find(j => j.id === jobId);
        if (job) {
          this.selectedJob = job;
          this.incrementViews(jobId);
        }
      }, 500);
    }
  }
};
</script>
