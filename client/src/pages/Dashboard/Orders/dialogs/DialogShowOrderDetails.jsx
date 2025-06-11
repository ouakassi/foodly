import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoadingSpinner from "../../../../components/Forms/LoadingSpinner";
import { FaPhone, FaRegFileAlt, FaShippingFast, FaUser } from "react-icons/fa";

import { formatDate, formatCurrency } from "../../../../lib/helpers";
import { BsCreditCard2Back } from "react-icons/bs";

import { MdDateRange, MdEmail } from "react-icons/md";

import { HiOutlineDotsHorizontal } from "react-icons/hi";

import ContentContainer from "../../../../components/Dashboard/ContentContainer";
import { RiIdCardLine } from "react-icons/ri";
import { BiMoney } from "react-icons/bi";

const DialogShowOrderDetails = ({
  orderData: currentOrder,
  isOrderDataLoading,
  orderError,
}) => {
  const { order, user } = currentOrder || {};

  if (orderError) return <p>Error loading order.</p>;
  if (!order) return <p>No order details found.</p>;

  return (
    <DialogContent className="w-auto max-w-full min-h-[80vh] max-h-full">
      <DialogHeader>
        {isOrderDataLoading ? (
          <LoadingSpinner height={"1rem"} width={"1rem"} />
        ) : (
          <DialogTitle>
            <FaRegFileAlt className="icon" />
            Order {order.id}
            {/* <span className={`status ${statusConfig["Completed"].className}`}>
            {statusConfig[calculateOrderStatus("Paid", "Delivered")].icon}
            {calculateOrderStatus("Paid", "Delivered")}
          </span> */}
          </DialogTitle>
        )}
      </DialogHeader>
      <div className="order-details-buttons">
        <Tabs defaultValue="details" className="w-[400px]">
          <TabsList style={{ padding: "1.5rem 1rem" }}>
            <TabsTrigger style={{ padding: "0.5rem" }} value="details">
              🧾 Order Details{" "}
            </TabsTrigger>
            <TabsTrigger value="Customer">👤 Customer Information</TabsTrigger>
            <TabsTrigger value="Items">📦 Order Items</TabsTrigger>
            <TabsTrigger value="shipping">💳 Payment & Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <ContentContainer
              className="order-details-content"
              title={
                <>
                  <FaRegFileAlt className="icon" />
                  Order Details – Order {order.id}
                </>
              }
            >
              <p className="order-date">
                <span>
                  <strong>
                    <MdDateRange className="icon" />
                    Order Date:
                  </strong>
                </span>
                <span>{formatDate(order.createdAt)}</span>
              </p>

              {/* <p className="order-status">
                <span>
                  <strong>
                    <PiAirplaneTaxiingThin className="icon" />
                    Status:
                  </strong>
                </span>
                <span
                  className={`status ${statusConfig["Completed"].className}`}
                >
                  {statusConfig[calculateOrderStatus("Paid", "Delivered")].icon}
                  {calculateOrderStatus("Paid", "Delivered")}
                </span>
              </p> */}

              <p className="payment-status">
                <span>
                  <strong>
                    <BsCreditCard2Back className="icon" />
                    Payment Status:
                  </strong>
                </span>
                <span>{order.status} </span>
              </p>

              <p className="delivery-method">
                <span>
                  <strong>
                    <FaShippingFast className="icon" />
                    Delivery Method:
                  </strong>
                </span>
                <span>Aramex Express</span>
              </p>
              <p className="tracking-number">
                <span>
                  <strong>
                    <HiOutlineDotsHorizontal className="icon" />
                    Tracking Number:
                  </strong>
                </span>
                <span>{order.tracking || "N/A"}</span>
              </p>
              <p className="tracking-number">
                <span>
                  <strong>
                    <BiMoney className="icon" />
                    Order Total:
                  </strong>
                </span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </p>
            </ContentContainer>
          </TabsContent>
          <TabsContent value="Customer">
            <ContentContainer
              className={"order-details-content"}
              title={
                <>
                  <FaUser className="icon" />
                  Customer Information
                </>
              }
            >
              <p>
                <span>
                  <RiIdCardLine className="icon" />
                  <strong>Name:</strong>
                </span>
                <span>{`${order.user.firstName} ${order.user.lastName}`}</span>
              </p>

              <p>
                <span>
                  <MdEmail className="icon" />
                  <strong>Email:</strong>
                </span>
                <span>{order.user.email}</span>
              </p>

              <p>
                <span>
                  <FaPhone className="icon" />
                  <strong>Phone:</strong>
                </span>
                <span>{order.user.phone || "no phone"}</span>
              </p>

              {/* <p>
                <span>
                  <FaAddressCard className="icon" />
                  <strong>Billing Address:</strong>
                </span>
                <span>23 Rue Hassan II, Casablanca, Morocco</span>
              </p> */}

              <p>
                <span>
                  <FaShippingFast className="icon" />
                  <strong>Shipping Address:</strong>
                </span>
                <span>{order.shippingAddress}</span>
              </p>
            </ContentContainer>
          </TabsContent>

          <TabsContent value="Items">
            <ContentContainer
              className={"order-details-content"}
              title={<>📦 Order Items</>}
            >
              <div className="order-list flex flex-col gap-2">
                {order?.items?.map((item) => (
                  <div
                    key={item.id}
                    className="order-row flex items-center gap-4 p-2 "
                  >
                    <div className="product-img">
                      <img
                        src={item.product.imgUrl}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="name flex-1 ">{item.product.name}</div>
                    <div className="price">
                      {item.price ? formatCurrency(item.price, "USD") : "$0.00"}
                    </div>
                    <div className="quantity ">{`X${item.quantity}`}</div>
                  </div>
                ))}
              </div>
              <div className="order-summary">
                <p>
                  <strong>Total:</strong>
                  <span className="total-amount">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </p>
              </div>
            </ContentContainer>
          </TabsContent>
          <TabsContent value="shipping">
            <ContentContainer
              className={"order-details-content"}
              title={"📦Payment "}
            >
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Transaction ID:</strong> pi_34sdklfj9348sdlkj
              </p>
            </ContentContainer>
            <ContentContainer title={<>🚚 Shipping Information</>}>
              <p>
                <strong>Courier:</strong> Aramex
              </p>
              <p>
                <strong>Tracking Number:</strong>{" "}
                {order.trackingNumber || "N/A"}
              </p>
              <p>
                <strong>Estimated Delivery:</strong> May 9, 2025
              </p>
              <p>
                <strong>Delivered On:</strong> May 8, 2025
              </p>
            </ContentContainer>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
};

export default DialogShowOrderDetails;
