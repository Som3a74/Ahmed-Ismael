/**
 * custom-popup.js
 * Handles the logic for the Quick View popup in the custom-grid section.
 * Written in Vanilla ES6+ JavaScript.
 */

(function() {
  console.log("custom-popup.js loaded and executing IIFE.");
  
  let modal, closeBtn, form, popupTitle, popupPrice, popupDesc, popupImg, popupOptionsContainer, popupVariantIdInput, addToCartBtn;
  let currentProduct = null;
  let currentVariant = null;

  // Initialize elements
  const initElements = () => {
    modal = document.getElementById('customQuickViewModal');
    console.log("initElements: modal found?", !!modal);
    if (!modal) return false;
    
    closeBtn = modal.querySelector('.custom-popup-close');
    form = document.getElementById('popup-form');
    popupTitle = document.getElementById('popup-title');
    popupPrice = document.getElementById('popup-price');
    popupDesc = document.getElementById('popup-description');
    popupImg = document.getElementById('popup-image');
    popupOptionsContainer = document.getElementById('popup-options');
    popupVariantIdInput = document.getElementById('popup-variant-id');
    addToCartBtn = document.getElementById('popup-add-to-cart');
    
    return true;
  };

  const formatMoney = (cents) => {
    return '$' + (cents / 100).toFixed(2);
  };

  const openModal = (btn) => {
    console.log("openModal triggered with button:", btn);
    
    if (!modal && !initElements()) {
      console.error("openModal: initElements failed, modal not found in DOM!");
      return;
    }

    const productId = btn.getAttribute('data-product-id');
    console.log("openModal: productId is", productId);
    
    const jsonScript = document.getElementById(`product-json-${productId}`);
    const descDiv = document.getElementById(`product-desc-${productId}`);
    
    if (!jsonScript) {
      console.error("openModal: product-json script tag not found for id", productId);
      return;
    }

    try {
      currentProduct = JSON.parse(jsonScript.textContent);
      console.log("openModal: product parsed successfully", currentProduct.title);
    } catch (err) {
      console.error('Error parsing product JSON:', err);
      return;
    }

    popupTitle.textContent = currentProduct.title;
    popupDesc.innerHTML = descDiv ? descDiv.innerHTML : '';
    
    if (currentProduct.featured_image) {
      popupImg.src = currentProduct.featured_image;
    } else {
      popupImg.src = '';
    }

    renderOptions(currentProduct);

    currentVariant = currentProduct.variants.find(v => v.available) || currentProduct.variants[0];
    updateVariantSelection();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log("openModal: Modal should now be visible");
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const renderOptions = (product) => {
    popupOptionsContainer.innerHTML = ''; 

    if (product.variants.length === 1 && product.variants[0].title === 'Default Title') {
      return;
    }

    product.options.forEach((option, index) => {
      const optionGroup = document.createElement('div');
      optionGroup.className = 'custom-popup-option-group';
      
      const optionName = typeof option === 'string' ? option : option.name;
      const optionKey = `option${index + 1}`;
      
      // Extract unique values for this option from all variants
      const values = Array.from(new Set(product.variants.map(v => v[optionKey]).filter(Boolean)));
      
      const label = document.createElement('label');
      label.className = 'custom-popup-option-label';
      label.textContent = optionName;
      optionGroup.appendChild(label);

      const isColor = optionName.toLowerCase().includes('color') || optionName.toLowerCase().includes('colour');

      if (isColor) {
        const colorContainer = document.createElement('div');
        colorContainer.className = 'custom-popup-color-options';
        
        const slider = document.createElement('div');
        slider.className = 'custom-popup-color-slider';
        colorContainer.appendChild(slider);

        values.forEach(value => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'custom-popup-color-btn';
          btn.setAttribute('data-option-index', optionKey);
          btn.setAttribute('data-value', value);
          
          let hexColor = value.toLowerCase().replace(/ /g, '');
          if (value.toLowerCase() === 'red') hexColor = '#b20f36';
          if (value.toLowerCase() === 'grey') hexColor = '#afafb7';
          if (value.toLowerCase() === 'black') hexColor = '#000000';
          if (value.toLowerCase() === 'white') hexColor = '#ffffff';

          const swatch = document.createElement('span');
          swatch.className = 'custom-popup-color-swatch';
          swatch.style.backgroundColor = hexColor;

          btn.appendChild(swatch);
          const textNode = document.createTextNode(value);
          btn.appendChild(textNode);
          
          btn.addEventListener('click', () => handleOptionChange(optionKey, value, colorContainer));
          colorContainer.appendChild(btn);
        });

        optionGroup.appendChild(colorContainer);
      } else {
        const selectWrapper = document.createElement('div');
        selectWrapper.className = 'custom-popup-select-wrapper';

        const select = document.createElement('select');
        select.className = 'custom-popup-select';
        select.setAttribute('data-option-index', optionKey);

        values.forEach(value => {
          const opt = document.createElement('option');
          opt.value = value;
          opt.textContent = value;
          select.appendChild(opt);
        });

        select.addEventListener('change', (e) => handleOptionChange(optionKey, e.target.value));
        selectWrapper.appendChild(select);
        optionGroup.appendChild(selectWrapper);
      }

      popupOptionsContainer.appendChild(optionGroup);
    });
  };

  const handleOptionChange = (optionIndex, value, container = null) => {
    if (container && container.classList.contains('custom-popup-color-options')) {
      container.querySelectorAll('.custom-popup-color-btn').forEach(btn => btn.classList.remove('selected'));
      const selectedBtn = container.querySelector(`[data-value="${value}"]`);
      if (selectedBtn) {
        selectedBtn.classList.add('selected');
        const btns = Array.from(container.querySelectorAll('.custom-popup-color-btn'));
        const btnIndex = btns.indexOf(selectedBtn);
        const totalBtns = btns.length;
        container.style.setProperty('--btn-count', totalBtns);
        container.style.setProperty('--active-index', btnIndex);
      }
    }

    const currentOptions = {};
    const selectors = popupOptionsContainer.querySelectorAll('select, .custom-popup-color-btn.selected');
    
    selectors.forEach(el => {
      const idx = el.getAttribute('data-option-index');
      const val = el.tagName === 'SELECT' ? el.value : el.getAttribute('data-value');
      if (idx && val) {
        currentOptions[idx] = val;
      }
    });

    currentOptions[optionIndex] = value;

    currentVariant = currentProduct.variants.find(variant => {
      let match = true;
      if (currentOptions.option1 && variant.option1 !== currentOptions.option1) match = false;
      if (currentOptions.option2 && variant.option2 !== currentOptions.option2) match = false;
      if (currentOptions.option3 && variant.option3 !== currentOptions.option3) match = false;
      return match;
    });

    updateVariantSelection();
  };

  const updateVariantSelection = () => {
    if (!currentVariant) {
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = 'Unavailable';
      popupPrice.textContent = '---';
      return;
    }

    popupVariantIdInput.value = currentVariant.id;
    popupPrice.textContent = formatMoney(currentVariant.price);

    if (currentVariant.featured_image && currentVariant.featured_image.src) {
      popupImg.src = currentVariant.featured_image.src;
    }

    const option1 = currentVariant.option1;
    const option2 = currentVariant.option2;
    const option3 = currentVariant.option3;

    [option1, option2, option3].forEach((optValue, i) => {
      if (!optValue) return;
      const optionIndex = `option${i + 1}`;
      
      const select = popupOptionsContainer.querySelector(`select[data-option-index="${optionIndex}"]`);
      if (select) select.value = optValue;

      const colorBtn = popupOptionsContainer.querySelector(`.custom-popup-color-btn[data-option-index="${optionIndex}"][data-value="${optValue}"]`);
      if (colorBtn) {
        const container = colorBtn.parentElement;
        container.querySelectorAll('.custom-popup-color-btn').forEach(b => b.classList.remove('selected'));
        colorBtn.classList.add('selected');
        
        const btns = Array.from(container.querySelectorAll('.custom-popup-color-btn'));
        const btnIndex = btns.indexOf(colorBtn);
        const totalBtns = btns.length;
        container.style.setProperty('--btn-count', totalBtns);
        container.style.setProperty('--active-index', btnIndex);
      }
    });

    if (currentVariant.available) {
      addToCartBtn.disabled = false;
      addToCartBtn.innerHTML = 'ADD TO CART <span class="custom-popup-btn-arrow">&longrightarrow;</span>';
    } else {
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = 'Sold Out';
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!currentVariant || !currentVariant.available) return;

    addToCartBtn.classList.add('loading');
    addToCartBtn.disabled = true;

    const secondaryVariantId = modal.getAttribute('data-secondary-product-id');
    const isBlack = [currentVariant.option1, currentVariant.option2, currentVariant.option3].includes('Black');
    const isMedium = [currentVariant.option1, currentVariant.option2, currentVariant.option3].includes('Medium');

    const itemsToAdd = [];
    itemsToAdd.push({ id: currentVariant.id, quantity: 1 });

    if (isBlack && isMedium && secondaryVariantId) {
      itemsToAdd.push({ id: parseInt(secondaryVariantId, 10), quantity: 1 });
    }

    try {
      const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToAdd })
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      addToCartBtn.classList.remove('loading');
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = 'Added!';
      
      setTimeout(() => {
        closeModal();
        addToCartBtn.innerHTML = 'ADD TO CART <span class="custom-popup-btn-arrow">&longrightarrow;</span>';
      }, 1000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      addToCartBtn.classList.remove('loading');
      addToCartBtn.disabled = false;
      addToCartBtn.textContent = 'Error';
    }
  };

  // Event Delegation for opening modal (handles dynamic DOM and async loads)
  document.addEventListener('click', (e) => {
    // Check if clicked element or its parent is the open button
    const btn = e.target.closest('.open-popup-btn');
    if (btn) {
      e.preventDefault();
      openModal(btn);
    }
    
    // Check for close button
    if (e.target.closest('.custom-popup-close')) {
      e.preventDefault();
      closeModal();
    }
    
    // Check for clicking outside modal content
    if (modal && e.target === modal) {
      closeModal();
    }
  });

  // Event Listener for form submit
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'popup-form') {
      handleAddToCart(e);
    }
  });

})();
