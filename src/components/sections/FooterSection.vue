<template>
  <footer class="app-footer">
    <div class="footer-content">
      <!-- Brand & Social -->
      <div class="footer-section brand-section">
        <div class="brand-logo">
           <span class="material-icons-round logo-icon">diamond</span>
           <span class="brand-name">AuraShop</span>
        </div>
        <p class="footer-desc">Premium fashion and lifestyle products curated just for you.</p>
        <div class="social-links">
            <a href="#" class="social-link"><span class="material-icons-round">facebook</span></a>
            <a href="#" class="social-link"><span class="material-icons-round">camera_alt</span></a>
            <a href="#" class="social-link"><span class="material-icons-round">alternate_email</span></a>
        </div>
      </div>
      
      <!-- Mobile Accordion / Desktop Grid -->
      <div class="footer-links-container">
          <!-- Shop -->
          <div class="footer-section link-group">
            <h4 class="footer-heading" @click="toggleSection('shop')">
                Shop 
                <span class="material-icons-round expand-icon mobile-only" :class="{ rotated: openSections.shop }">expand_more</span>
            </h4>
            <div class="link-list" :class="{ open: openSections.shop }">
                <a href="#" class="footer-link">New Arrivals</a>
                <a href="#" class="footer-link">Best Sellers</a>
                <a href="#" class="footer-link">Sale</a>
                <a href="#" class="footer-link">Collections</a>
            </div>
          </div>
          
          <!-- Support -->
          <div class="footer-section link-group">
            <h4 class="footer-heading" @click="toggleSection('support')">
                Support
                <span class="material-icons-round expand-icon mobile-only" :class="{ rotated: openSections.support }">expand_more</span>
            </h4>
            <div class="link-list" :class="{ open: openSections.support }">
                <a href="#" class="footer-link">Help Center</a>
                <a href="#" class="footer-link">Shipping & Returns</a>
                <a href="#" class="footer-link">Size Guide</a>
                <a href="#" class="footer-link">Contact Us</a>
            </div>
          </div>
          
          <!-- Legal -->
          <div class="footer-section link-group">
            <h4 class="footer-heading" @click="toggleSection('legal')">
                Legal
                <span class="material-icons-round expand-icon mobile-only" :class="{ rotated: openSections.legal }">expand_more</span>
            </h4>
            <div class="link-list" :class="{ open: openSections.legal }">
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Terms of Service</a>
                <a href="#" class="footer-link">Cookie Policy</a>
            </div>
          </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2024 AuraShop. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, reactive } from 'vue';

const openSections = reactive({
    shop: false,
    support: false,
    legal: false
});

const toggleSection = (section) => {
    // Only toggle on mobile where the icon is visible/logic applies
    if (window.innerWidth <= 768) {
        openSections[section] = !openSections[section];
    }
};
</script>

<style scoped>
.app-footer {
  background: var(--bg-color);
  border-top: 1px solid var(--glass-border);
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl);
  margin-top: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
}

/* Glass effect background for footer */
.app-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 3fr;
  gap: var(--spacing-2xl);
  position: relative;
  z-index: 1;
}

.footer-links-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--brand-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--text-xl);
  margin-bottom: var(--spacing-md);
}

.footer-desc {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.social-link:hover {
  color: var(--brand-primary);
  background: var(--glass-bg-hover);
  transform: translateY(-2px);
  box-shadow: var(--glass-shadow);
}

.footer-heading {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-link {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: var(--spacing-sm);
  transition: color 0.2s;
  font-size: var(--text-base);
}

.footer-link:hover {
  color: var(--brand-primary);
  padding-left: 4px;
}

.footer-bottom {
  max-width: 1280px;
  margin: var(--spacing-2xl) auto 0;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--glass-border);
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  position: relative;
  z-index: 1;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .footer-links-container {
      display: flex;
      flex-direction: column;
      gap: 0; /* Remove gap for accordion style */
  }

  .footer-section.link-group {
      border-bottom: 1px solid var(--glass-border);
  }
  
  .footer-section.link-group:last-child {
      border-bottom: none;
  }

  .footer-heading {
      margin-bottom: 0;
      padding: var(--spacing-md) 0;
      cursor: pointer;
      font-size: var(--text-base);
  }

  .link-list {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
  }

  .link-list.open {
      max-height: 200px; /* Adjust based on content */
      padding-bottom: var(--spacing-md);
  }

  .expand-icon {
      transition: transform 0.3s ease;
  }

  .expand-icon.rotated {
      transform: rotate(180deg);
  }
  
  .brand-section {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
  }
  
  .footer-desc {
      text-align: center;
  }
}
</style>
