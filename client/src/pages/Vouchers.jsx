import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/css/Vouchers.css";
import useVoucherStore from "../store/voucherStore";
import { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTicket,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import VoucherCard from "../components/VoucherCard";
import { toast } from "react-hot-toast";
import voucherService from "../services/voucherService";

const Vouchers = () => {
  const selectedCategory = useVoucherStore((state) => state.selectedCategory);
  const voucherCode = useVoucherStore((state) => state.voucherCode);
  const getFilteredVouchers = useVoucherStore(
    (state) => state.getFilteredVouchers
  );
  const {
    setSelectedCategory,
    setVoucherCode,
    submitVoucherCode,
    fetchVouchers,
    claimVoucher,
    loading,
    error,
  } = useVoucherStore();

  const [showCodeList, setShowCodeList] = useState(false);
  const [userVouchers, setUserVouchers] = useState([]);
  const [loadingUserVouchers, setLoadingUserVouchers] = useState(false);

  const filteredVouchers = useMemo(
    () => getFilteredVouchers(),
    [
      selectedCategory,
      getFilteredVouchers,
      useVoucherStore((state) => state.vouchers),
    ]
  );

  // Filter user vouchers based on selected category
  const filteredUserVouchers = useMemo(() => {
    return selectedCategory === "All"
      ? userVouchers
      : userVouchers.filter(
          (voucher) => voucher.globalVoucher.category === selectedCategory
        );
  }, [userVouchers, selectedCategory]);

  const categories = ["All", "Food", "Car", "Bike"];

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    rows: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    try {
      await claimVoucher(voucherCode);
      toast.success("Voucher claimed successfully!");
      submitVoucherCode();
      // Refresh user vouchers after claiming
      fetchUserVouchers();
    } catch (error) {
      // Display the error message from the API response
      toast.error(error.message || "Failed to claim voucher");
      // Clear the voucher code input
      setVoucherCode("");
    }
  };

  const fetchUserVouchers = async () => {
    setLoadingUserVouchers(true);
    try {
      const data = await voucherService.getUserVouchers();
      setUserVouchers(data);
    } catch (error) {
      console.error("Error fetching user vouchers:", error);
      toast.error("Failed to fetch your vouchers");
    } finally {
      setLoadingUserVouchers(false);
    }
  };

  const handleUseVoucher = (voucher) => {
    alert(`Using voucher: ${voucher.code}`);
  };

  const renderVouchers = () => {
    if (loadingUserVouchers) {
      return <div>Loading your vouchers...</div>;
    }

    if (userVouchers.length === 0) {
      return (
        <div className="no-vouchers">
          <FontAwesomeIcon icon={faTicket} />
          <p>No vouchers available</p>
          <p>Enter a valid voucher code to claim your voucher!</p>
        </div>
      );
    }

    const vouchersToShow = filteredUserVouchers;

    if (vouchersToShow.length === 0) {
      return (
        <div className="no-vouchers">
          <FontAwesomeIcon icon={faTicket} />
          <p>No vouchers found in this category</p>
          <p>Try selecting a different category or claim more vouchers!</p>
        </div>
      );
    }

    if (vouchersToShow.length <= 3) {
      return (
        <div className="vouchers-grid">
          {vouchersToShow.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher.globalVoucher}
              isUsed={voucher.isUsed}
              claimedAt={voucher.claimedAt}
              userVoucherId={voucher.id}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="vouchers-carousel">
        <Slider {...sliderSettings}>
          {vouchersToShow.map((voucher) => (
            <div key={voucher.id} className="carousel-item">
              <VoucherCard
                voucher={voucher.globalVoucher}
                isUsed={voucher.isUsed}
                claimedAt={voucher.claimedAt}
                userVoucherId={voucher.id}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  useEffect(() => {
    fetchVouchers();
    fetchUserVouchers();
  }, [fetchVouchers]);

  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="vouchers-page">
      <button className="back-icon-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="vouchers-header">
        <div className="input-section">
          <div className="input-container">
            <form className="input-vcode" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter Voucher Code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Claiming..." : "Submit"}
              </button>
            </form>
            <button
              className="info-button"
              onClick={() => setShowCodeList(!showCodeList)}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </div>

          {showCodeList && (
            <div className="code-list">
              <h4>Available Voucher Codes:</h4>
              <ul>
                {filteredVouchers.map((voucher) => (
                  <li key={voucher.code}>
                    {voucher.code} - {voucher.voucher} (
                    {voucher.price.toLocaleString("id-ID")})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}>
            {category} Vouchers
          </button>
        ))}
      </div>

      <div className="vouchers-content">{renderVouchers()}</div>
    </div>
  );
};

export default Vouchers;
