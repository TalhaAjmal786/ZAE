/* ZAE - repair the mobile header cart button.
 *
 * sections/header-mobile.liquid renders the cart <a> like this:
 *
 *   {% if settings.show_quick_cart %}
 *     {% if routes.account_login_url == '/account/login' %}   <- extra condition
 *       data-cart-sidebar href="javascript:void(0)"
 *     {% endif %}                                             <- nothing if false
 *   {% else %}
 *     href="{{ routes.cart_url }}"
 *   {% endif %}
 *
 * On stores using new customer accounts, routes.account_login_url is NOT
 * '/account/login', so the anchor ends up with no href AND no data attribute:
 * a completely dead button. The desktop header has no such condition, which is
 * why desktop works and mobile does not.
 *
 * The clean fix is one line of Liquid in header-mobile.liquid. This script is the
 * runtime equivalent, for when that 43KB file cannot safely be rewritten.
 * It touches nothing else.
 */
(function () {
  'use strict';

  function repair() {
    var links = document.querySelectorAll('a.header__icon--cart, #cart-icon-bubble-toolbar, [id="cart-icon-bubble toolbar"]');

    Array.prototype.forEach.call(links, function (a) {
      if (a.dataset.zaeCartFixed === '1') return;

      var hasSidebar = a.hasAttribute('data-cart-sidebar');
      var hasPopup   = a.hasAttribute('data-open-cart-popup');
      var href       = a.getAttribute('href');
      var hasHref    = href !== null && href !== '';

      if (hasSidebar || hasPopup || hasHref) {
        if (!hasHref || href === 'javascript:void(0)') a.setAttribute('href', (window.routes && window.routes.cart) || '/cart');
        a.dataset.zaeCartFixed = '1';
        return;
      }

      var qc = window.quick_cart || {};
      var cartUrl = (window.routes && window.routes.cart) || '/cart';

      if (qc.show === true && qc.type === 'popup') {
        a.setAttribute('data-open-cart-popup', '');
        a.setAttribute('href', cartUrl);
      } else if (qc.show === true) {
        a.setAttribute('data-cart-sidebar', '');
        a.setAttribute('href', cartUrl);
      } else {
        a.setAttribute('href', cartUrl);
      }

      a.dataset.zaeCartFixed = '1';
    });

    // id="cart-icon-bubble mobile" contains a space, which is not a valid id.
    var bad = document.querySelector('[id="cart-icon-bubble mobile"]');
    if (bad) bad.id = 'cart-icon-bubble-mobile';
    var badToolbar = document.querySelector('[id="cart-icon-bubble toolbar"]');
    if (badToolbar) badToolbar.id = 'cart-icon-bubble-toolbar';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', repair);
  } else {
    repair();
  }

  document.addEventListener('shopify:section:load', repair);
})();
