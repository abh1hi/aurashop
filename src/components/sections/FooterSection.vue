<template>
  <footer class="app-footer glass-footer">
    <div class="footer-container container">
      <!-- Brand & Info Section -->
      <div class="footer-brand-grid">
        <div class="brand-wrap">
          <div class="premium-logo">
            <span class="material-icons-round logo-glow">diamond</span>
            <span class="logo-text">AURASHOP</span>
          </div>
          <p class="brand-mission">
            Defining the future of luxury commerce through curated selection and AI-driven personalization.
          </p>
          <div class="social-dock">
            <a href="#" class="social-circle" aria-label="Instagram">
              <span class="material-icons-round">camera_alt</span>
            </a>
            <a href="#" class="social-circle" aria-label="X">
              <span class="material-icons-round">alternate_email</span>
            </a>
            <a href="#" class="social-circle" aria-label="Facebook">
              <span class="material-icons-round">facebook</span>
            </a>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="newsletter-card-glass">
          <h4 class="newsletter-title">Join The Inner Circle</h4>
          <p class="newsletter-sub">Get exclusive access to pre-launch drops and seasonal curations.</p>
          <div class="newsletter-input-group">
            <input type="email" placeholder="Your email address" class="glass-input" />
            <button class="glass-submit">Join</button>
          </div>
        </div>
      </div>

      <div class="footer-divider-glow"></div>

      <!-- Links Accordion Grid -->
      <div class="footer-accordion-grid">
        <div v-for="(group, id) in linkGroups" :key="id" class="accordion-item-glass">
          <button class="accordion-trigger" @click="toggleSection(id)">
            <span class="trigger-label">{{ group.title }}</span>
            <span class="material-icons-round trigger-icon" :class="{ rotated: openSections[id] }">
              add
            </span>
          </button>
          
          <div class="accordion-content" :class="{ expanded: openSections[id] }">
            <div class="link-list-premium">
              <a v-for="link in group.links" :key="link.text" :href="link.url" class="premium-footer-link">
                {{ link.text }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-legal-bar">
        <div class="legal-left">
          &copy; 2024 AURASHOP. DEFINING PREMIUM.
        </div>
        <div class="legal-right">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { reactive } from 'vue';

const openSections = reactive({
  shop: true,
  support: false,
  legal: false
});

const linkGroups = {
  shop: {
    title: 'Shop Collections',
    links: [
      { text: 'New Arrivals', url: '#' },
      { text: 'Best Sellers', url: '#' },
      { text: 'Limited Drops', url: '#' },
      { text: 'Lookbook', url: '#' }
    ]
  },
  support: {
    title: 'Client Service',
    links: [
      { text: 'Help Center', url: '#' },
      { text: 'Concierge', url: '#' },
      { text: 'Shipping & Returns', url: '#' },
      { text: 'Size Guide', url: '#' }
    ]
  },
  legal: {
    title: 'Information',
    links: [
      { text: 'Our Story', url: '#' },
      { text: 'Privacy Policy', url: '#' },
      { text: 'Terms of Use', url: '#' },
      { text: 'Sustainability', url: '#' }
    ]
  }
};

const toggleSection = (id) => {
  openSections[id] = !openSections[id];
};
</script>

<style scoped>
.glass-footer {
  background: var(--bg-color);
  border-top: 1px solid var(--glass-border);
  padding: 80px 0 40px;
  position: relative;
  overflow: hidden;
  margin-top: 80px;
}

.glass-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brand-primary), transparent);
  opacity: 0.3;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Brand Grid */
.footer-brand-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  margin-bottom: 60px;
  align-items: center;
}

.premium-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.logo-glow {
  font-size: 32px;
  color: var(--brand-primary);
  text-shadow: 0 0 15px color-mix(in srgb, var(--brand-primary) 30%, transparent);
}

.logo-text {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: var(--primary-text);
}

.brand-mission {
  color: var(--secondary-text);
  font-size: var(--text-base);
  line-height: 1.6;
  max-width: 380px;
  margin-bottom: 32px;
}

.social-dock {
  display: flex;
  gap: 16px;
}

.social-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--liquid-glass-base);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-text);
  transition: all 0.4s var(--ease-out);
}

.social-circle:hover {
  background: var(--brand-primary);
  color: white;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 113, 227, 0.2);
}

/* Newsletter Card */
.newsletter-card-glass {
  background: var(--liquid-glass-base);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  padding: 40px;
  border-radius: var(--radius-2xl);
  box-shadow: var(--glass-shadow);
}

.newsletter-title {
  font-size: var(--text-xl);
  font-weight: 900;
  margin-bottom: 8px;
  color: var(--primary-text);
}

.newsletter-sub {
  color: var(--secondary-text);
  margin-bottom: 24px;
  font-size: var(--text-sm);
}

.newsletter-input-group {
  display: flex;
  gap: 12px;
}

.glass-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  padding: 14px 24px;
  color: var(--primary-text);
  outline: none;
  transition: all 0.3s;
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--brand-primary);
}

.glass-submit {
  background: var(--brand-primary);
  color: white;
  border: none;
  padding: 0 32px;
  border-radius: var(--radius-full);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.glass-submit:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
}

.footer-divider-glow {
  height: 1px;
  background: linear-gradient(90deg, var(--glass-border), rgba(255, 255, 255, 0.1), var(--glass-border));
  margin-bottom: 40px;
}

/* Accordion Grid */
.footer-accordion-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.accordion-item-glass {
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.3s;
}

.accordion-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.trigger-label {
  font-size: var(--text-lg);
  font-weight: 800;
  color: var(--primary-text);
  letter-spacing: -0.02em;
}

.trigger-icon {
  font-size: 20px;
  color: var(--brand-primary);
  transition: transform 0.4s var(--ease-elastic);
}

.trigger-icon.rotated {
  transform: rotate(45deg);
  color: var(--secondary-text);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-content.expanded {
  max-height: 400px;
  opacity: 1;
  transform: translateY(0);
}

.link-list-premium {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 30px;
}

.premium-footer-link {
  color: var(--secondary-text);
  text-decoration: none;
  font-size: var(--text-base);
  font-weight: 500;
  transition: all 0.3s;
}

.premium-footer-link:hover {
  color: var(--brand-primary);
  transform: translateX(6px);
}

/* Legal Bar */
.footer-legal-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid var(--glass-border);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.legal-right {
  display: flex;
  gap: 24px;
}

.legal-right a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.legal-right a:hover {
  color: var(--primary-text);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .footer-brand-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .brand-mission {
    margin-left: auto;
    margin-right: auto;
  }
  
  .social-dock {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer-accordion-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .accordion-item-glass {
    border-bottom: 1px solid var(--glass-border);
    border-radius: 0;
  }
  
  .accordion-trigger {
    padding: 24px 0;
  }
}
</style>
