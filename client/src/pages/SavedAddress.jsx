import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAddressStore from "../store/addressStore";
import usePickupStore from "../store/pickupStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEllipsisVertical,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/css/SavedAddress.css";
import { toast } from "react-hot-toast";

const SavedAddress = () => {
  const navigate = useNavigate();
  const { addresses, deleteAddress, fetchAddresses } = useAddressStore();
  const setPickupAddress = usePickupStore((state) => state.setPickupAddress);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleMenuClick = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleEdit = (id) => {
    navigate(`/edit-address/${id}`);
    setActiveMenu(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      deleteAddress(id);
      setActiveMenu(null);
    }
  };

  const handleUseAddress = (address) => {
    setPickupAddress(address);
    toast.success("Pickup address selected!");
    navigate("/");
  };

  return (
    <div className="saved-address-container">
      <div className="address-header">
        <h1>Saved Addresses</h1>
        <button
          className="add-address-btn"
          onClick={() => navigate("/add-address")}>
          <FontAwesomeIcon icon={faPlus} /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="empty-state">
          <FontAwesomeIcon icon={faLocationDot} className="empty-icon" />
          <p>No saved addresses</p>
          <button
            className="add-first-address-btn"
            onClick={() => navigate("/add-address")}>
            <FontAwesomeIcon icon={faPlus} /> Add Your First Address
          </button>
        </div>
      ) : (
        <div className="addresses-list">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="card-header">
                <span className={`label ${address.label}`}>
                  {address.label}
                </span>
                <button
                  className="menu-btn"
                  onClick={() => handleMenuClick(address.id)}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
                {activeMenu === address.id && (
                  <div className="menu-options">
                    <button onClick={() => handleEdit(address.id)}>Edit</button>
                    <button onClick={() => handleDelete(address.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="address-info">
                <h3>{address.name}</h3>
                <p className="recipient">Recipient: {address.recipientName}</p>
                <p className="phone">Phone: {address.phone}</p>
                <p className="address-text">{address.address}</p>
                {address.notes && (
                  <p className="notes">Notes: {address.notes}</p>
                )}
              </div>
              <button
                className="use-address-btn"
                onClick={() => handleUseAddress(address)}>
                Use Address
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAddress;
