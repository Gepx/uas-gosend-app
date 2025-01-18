import { useNavigate, useLocation } from "react-router-dom";
import useVoucherStore from "../store/voucherStore";
import { toast } from "react-hot-toast";

const VoucherCard = ({ voucher }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deliveryCost, applyVoucher, appliedVoucher } = useVoucherStore();

  const currentDate = new Date();
  const validUntil = new Date(voucher.validUntil);
  const isExpired = currentDate > validUntil;

  // Get the original price from location state
  const originalPrice = location.state?.originalPrice;

  // Check minimum purchase against original price, not the discounted price
  const isBelowMinPurchase = originalPrice
    ? originalPrice < voucher.minPurchase
    : deliveryCost < voucher.minPurchase;

  const handleUseVoucher = async () => {
    try {
      if (isExpired) {
        toast.error("This voucher has expired");
        return;
      }

      if (isBelowMinPurchase) {
        toast.error(
          `Minimum purchase required: Rp ${voucher.minPurchase.toLocaleString(
            "id-ID"
          )}`
        );
        return;
      }

      // Apply the voucher and navigate back
      applyVoucher(voucher);
      toast.success("Voucher applied successfully!");
      navigate(-1, {
        state: {
          ...location.state,
          returnTo: "/delivery-distance",
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="voucher-card">
      <h3>{voucher.voucher} Voucher</h3>
      <p className="price">Rp {voucher.price.toLocaleString("id-ID")}</p>
      <p className="description">
        Get Rp {voucher.price.toLocaleString("id-ID")} off on your{" "}
        {voucher.category.toLowerCase()} order
      </p>
      <p className="min-purchase">
        Minimum Purchase: Rp {voucher.minPurchase.toLocaleString("id-ID")}
      </p>
      <p className="valid-until">
        Valid Until: {new Date(voucher.validUntil).toLocaleDateString()}
      </p>
      <button
        className={`use-button ${
          isExpired || isBelowMinPurchase ? "disabled" : ""
        }`}
        onClick={handleUseVoucher}
        disabled={isExpired || isBelowMinPurchase}>
        {isExpired
          ? "Expired"
          : isBelowMinPurchase
          ? `Min. Purchase Rp ${voucher.minPurchase.toLocaleString("id-ID")}`
          : appliedVoucher
          ? "Change voucher"
          : "Use"}
      </button>
    </div>
  );
};

export default VoucherCard;
