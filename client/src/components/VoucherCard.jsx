import { useNavigate } from "react-router-dom";
import useVoucherStore from "../store/voucherStore";
import { toast } from "react-hot-toast";

const VoucherCard = ({ voucher }) => {
  const navigate = useNavigate();
  const { deliveryCost, applyVoucher } = useVoucherStore();

  const currentDate = new Date();
  const validUntil = new Date(voucher.validUntil);
  const isExpired = currentDate > validUntil;
  const isBelowMinPurchase = deliveryCost < voucher.minPurchase;

  const handleUseVoucher = () => {
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

      applyVoucher(voucher);
      navigate(-1);
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
        Valid Until: {new Date(voucher.validUntil).toLocaleDateString("id-ID")}
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
          : "Use"}
      </button>
    </div>
  );
};

export default VoucherCard;
