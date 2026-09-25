if (!customElements.get("quick-add-modal")) {
  customElements.define(
    "quick-add-modal",
    class QuickAddModal extends ModalDialog {
      constructor() {
        super();
        this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

        this.addEventListener("product-info:loaded", ({ target }) => {
          target.addPreProcessCallback(this.preprocessHTML.bind(this));
        });
      }

      hide(preventFocus = false) {
        const cartNotification =
          document.querySelector("cart-notification") ||
          document.querySelector("cart-drawer");
        if (cartNotification) cartNotification.setActiveElement(this.openedBy);
        this.modalContent.innerHTML = "";

        if (preventFocus) this.openedBy = null;
        super.hide();
      }

      show(opener) {
        opener.setAttribute("aria-disabled", true);
        opener.classList.add("loading");
        opener.querySelector(".loading__spinner").classList.remove("hidden");

        fetch(opener.getAttribute("data-product-url"))
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            const productElement = responseHTML.querySelector("product-info");

            this.preprocessHTML(productElement);
            HTMLUpdateUtility.setInnerHTML(
              this.modalContent,
              productElement.outerHTML
            );

            if (window.Shopify && Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }

            if (window.ProductModel) {
              window.ProductModel.loadShopifyXR();
            }

            // Safe-guard: only call SWishlist if it's defined
            if (typeof SWishlist === "function") {
              SWishlist();
            }

            super.show(opener);
          })
          .finally(() => {
            opener.removeAttribute("aria-disabled");
            opener.classList.remove("loading");
            opener.querySelector(".loading__spinner").classList.add("hidden");
          });
      }

      preprocessHTML(productElement) {
        productElement.classList.forEach((classApplied) => {
          if (classApplied.startsWith("color-") || classApplied === "gradient") {
            this.modalContent.classList.add(classApplied);
          }
        });
        this.preventDuplicatedIDs(productElement);
        this.removeDOMElements(productElement);
        this.removeGalleryListSemantic(productElement);
        this.updateImageSizes(productElement);
        this.preventVariantURLSwitching(productElement);
      }

      preventVariantURLSwitching(productElement) {
        productElement.setAttribute("data-update-url", "false");
      }

      removeDOMElements(productElement) {
        const pickupAvailability = productElement.querySelector(
          "pickup-availability"
        );
        if (pickupAvailability) pickupAvailability.remove();

        const productModal = productElement.querySelector("product-modal");
        if (productModal) productModal.remove();

        productElement
          .querySelectorAll("modal-dialog")
          .forEach((modal) => modal.remove());
      }

      preventDuplicatedIDs(productElement) {
        const sectionId = productElement.dataset.section;
        const newId = `quickadd-${sectionId}`;

        productElement.innerHTML = productElement.innerHTML.replaceAll(
          sectionId,
          newId
        );
        Array.from(productElement.attributes).forEach((attribute) => {
          if (attribute.value.includes(sectionId)) {
            productElement.setAttribute(
              attribute.name,
              attribute.value.replace(sectionId, newId)
            );
          }
        });

        productElement.dataset.originalSection = sectionId;
      }

      removeGalleryListSemantic(productElement) {
        const galleryList = productElement.querySelector(
          '[id^="Slider-Gallery"]'
        );
        if (!galleryList) return;

        galleryList.setAttribute("role", "presentation");
        galleryList
          .querySelectorAll('[id^="Slide-"]')
          .forEach((li) => li.setAttribute("role", "presentation"));
      }

      updateImageSizes(productElement) {
        const product = productElement.querySelector(".product");
        if (!product?.classList.contains("product--columns")) return;

        let sizes =
          "(min-width: 1000px) 715px, (min-width: 749px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";
        if (product.classList.contains("product--medium")) {
          sizes = sizes.replace("715px", "605px");
        } else if (product.classList.contains("product--small")) {
          sizes = sizes.replace("715px", "495px");
        }

        product
          .querySelectorAll(".product__media img")
          .forEach((img) => img.setAttribute("sizes", sizes));
      }
    }
  );
}
