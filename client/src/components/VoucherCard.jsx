import { useNavigate } from "react-router-dom";
import useVoucherStore from "../store/voucherStore";
import { toast } from "react-hot-toast";

const VoucherCard = ({ voucher }) => {
  const navigate = useNavigate();
  const { deliveryCost, applyVoucher, useVoucher } = useVoucherStore();

  const currentDate = new Date();
  const validUntil = new Date(voucher.validUntil);
  const isExpired = currentDate > validUntil;
  const isBelowMinPurchase = deliveryCost < voucher.minPurchase;

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

      if (voucher.isUsed) {
        toast.error("This voucher has already been used");
        return;
      }

      // If we're applying the voucher to a delivery
      if (deliveryCost > 0) {
        applyVoucher(voucher);
        navigate(-1);
      } else {
        // If we're just marking it as used
        await useVoucher(voucher.userVoucherId);
        toast.success("Voucher marked as used");
      }
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
      {voucher.claimedAt && (
        <p className="claimed-at">
          Claimed: {new Date(voucher.claimedAt).toLocaleDateString("id-ID")}
        </p>
      )}
      <button
        className={`use-button ${
          isExpired || isBelowMinPurchase || voucher.isUsed ? "disabled" : ""
        }`}
        onClick={handleUseVoucher}
        disabled={isExpired || isBelowMinPurchase || voucher.isUsed}>
        {isExpired
          ? "Expired"
          : voucher.isUsed
          ? "Used"
          : isBelowMinPurchase
          ? `Min. Purchase Rp ${voucher.minPurchase.toLocaleString("id-ID")}`
          : "Use"}
      </button>
    </div>
  );
};

export default VoucherCard;
