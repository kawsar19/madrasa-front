addToCartNew() {
      // alert(this.product_core.FirstLotQuantity);
      if (!this.isLoggedIn) {
        this.$toast.open({
          position: "top",
          message: "Please Log In To Continue!",
          type: "warning"
        });
        if (process.browser) {
          $("#loginModal").modal("show");
        }
        return false;
      }
      if (this.totalCartitemCount > 0) {
        if (parseInt(this.totalCartPrice) > 999) {
          if (this.totalCartitemCount >= this.wholesale_min_qty) {
            let variants = [];
            if (this.allVariations.length > 0) {
              this.allVariations
                .filter(a => a.cartQuantity > 0)
                .forEach(variant => {
                  // console.log(variant)
                  // console.log("discountPercentage", this.discountPercentage)
                  // console.log("flatDiscountPrice", this.flatDiscountPrice)
                  // console.log("isWholesale", this.is_wholesale)
                  // console.log("currentUsinPtrice", this.current_unit_price)
                  const data = {
                    id: variant.id,
                    attributes: variant.attributes,
                    attributeTypes: this.attributeTypes,
                    attributeNames: variant.attributeNames,
                    cartQuantity: variant.cartQuantity,
                    //   price: this.discountPercentage > 0 ? this.flatDiscountPrice: this.is_wholesale ? this.current_unit_price : parseFloat(variant.price.ConvertedPriceWithoutSign),
                    price:
                      this.discountPercentage > 0
                        ? parseFloat(variant.price.ConvertedPriceWithoutSign) *
                          (1 - this.discountPercentage / 100)
                        : this.is_wholesale
                        ? this.current_unit_price
                        : parseFloat(variant.price.ConvertedPriceWithoutSign),
                    stock: variant.qty,
                    image:
                      variant.attributeImages &&
                      variant.attributeImages.length > 0
                        ? variant.attributeImages[0]
                        : null
                  };
                  variants.push(data);
                });
            }
            let cartProduct = {
              product_id: this.product_core.Id,
              price: Math.ceil(this.totalCartPrice),
              unitPrice:
                this.discountPercentage > 0
                  ? this.flatDiscountPrice
                  : this.current_unit_price,
              // unitPrice : this.discountPercentage > 0 ? parseFloat(variant.price.ConvertedPriceWithoutSign)  * (1 - this.discountPercentage / 100) : this.current_unit_price,
              image_url: this.productImageUrl,
              product_name: this.product_core.Title,
              quantity: this.totalCartitemCount,
              quantityRanges: this.quantityWisePrice,
              vendor_id: this.vendorInfo.Id,
              vendor_name: this.vendorInfo.Name,
              variants
            };
            cartProduct.totalPrice =
              cartProduct.unitPrice * cartProduct.quantity;

            if (
              this.cartItems.find(c => c.product_id == cartProduct.product_id)
            ) {
              this.$toast.open({
                position: "top",
                message: "Product is already in your cart!",
                type: "warning"
              });
            } else {
              this.$store.commit("addToCartNew", cartProduct);
              this.$toast.open({
                position: "top",
                message: "Product added in your cart!",
                type: "success"
              });
            }
          } else {
            this.$toast.open({
              position: "top",
              message: `Minimum Order Quantity ${this.wholesale_min_qty}`,
              type: "warning"
            });
            return false;
          }
        } else {
          this.$toast.open({
            position: "top",
            message: "Minimum Order Value 1000 Taka.",
            type: "warning"
          });
          return false;
        }
      } else {
        this.$toast.open({
          position: "top",
          message: "Please select products for cart.",
          type: "warning"
        });
        return false;
      }
    },