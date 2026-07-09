class CustomerAuth extends HTMLElement {
	constructor() {
		super();
        this.activeTrigger = null;

        if(document.querySelector('[data-open-auth-popup]')){
            document.querySelectorAll('[data-open-auth-popup]').forEach((openPopup) =>
                openPopup.addEventListener('click', this.setOpenPopup.bind(this))
            );
        }

        if(document.querySelector('[data-close-auth-popup]')){
    		document.querySelector('[data-close-auth-popup]').addEventListener(
                'click',
                this.setClosePopup.bind(this)
            );
        }
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Escape'){
                event.preventDefault();
                event.stopPropagation();

                document.body.classList.remove('auth-popup-show');
                removeTrapFocus(this.activeTrigger);
            }
        });

        if(document.querySelector('[data-open-auth-sidebar]')){
            document.querySelectorAll('[data-open-auth-sidebar]').forEach((openSidebar) =>
                openSidebar.addEventListener('click',this.setOpenSidebar.bind(this))
            );
        }

        if(document.querySelector('[data-close-auth-sidebar]')){
            document.querySelector('[data-close-auth-sidebar]').addEventListener(
                'click',
                this.setCloseSidebar.bind(this)
            );
        }

        document.body.addEventListener('click', this.onBodyClickEvent.bind(this));
	}

    setOpenPopup(event){
        event.preventDefault();
        event.stopPropagation();

        this.activeTrigger = event.currentTarget;

        if (document.body.classList.contains('template-customers-login')) {
            $('html, body').animate({
                scrollTop: 0
            }, 700);
        } else {
            document.body.classList.add('auth-popup-show');
            const popup = document.querySelector('[data-auth-popup]');
            if (!popup) return;

            requestAnimationFrame(() => {
                setTimeout(() => {
                    const firstFocusable = popup.querySelector(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    trapFocus(popup, firstFocusable || popup);
                }, 100);
            });
        }
    }

    setClosePopup(event){
        event.preventDefault();
        event.stopPropagation();

        document.body.classList.remove('auth-popup-show');
        removeTrapFocus(this.activeTrigger);
    }

    setOpenSidebar(event){
        event.preventDefault();
        event.stopPropagation();

        if (document.body.classList.contains('template-customers-login')) {
            $('html, body').animate({
                scrollTop: 0
            }, 700);
        } else {
            document.body.classList.add('auth-sidebar-show');
            const sidebar = document.querySelector('[data-auth-sidebar]');
            if (!sidebar) return;

            requestAnimationFrame(() => {
                setTimeout(() => {
                    const firstFocusable = sidebar.querySelector(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );

                    trapFocus(sidebar, firstFocusable || sidebar);
                }, 50);
            });
        }
    }

    setCloseSidebar(event){
        event.preventDefault();
        event.stopPropagation();

        document.body.classList.remove('auth-sidebar-show');
        removeTrapFocus(this.activeTrigger);
    }

    onBodyClickEvent(event){
        if(document.body.classList.contains('auth-popup-show')){
            if ((!this.contains(event.target)) && (!(event.target).closest('[data-open-auth-popup]')) && (!(event.target).closest('[data-auth-popup]'))){
                this.setClosePopup(event);
            }
        }

        if(document.body.classList.contains('auth-sidebar-show')){
            if ((!this.contains(event.target)) && (!(event.target).closest('[data-open-auth-sidebar]')) && (!(event.target).closest('[data-auth-sidebar]'))){
                this.setCloseSidebar(event);
            }
        }
    }
}

customElements.define('customer-auth', CustomerAuth);