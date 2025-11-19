import { FaFileCirclePlus } from "react-icons/fa6";
import PageTitle from "../../../components/Dashboard/PageTitle";
import "./OrdersPage.css";
import CustomButton from "../../../components/Buttons/CustomButton";
import ContentContainer from "../../../components/Dashboard/ContentContainer";
import InputContainer from "../../../components/Forms/InputContainer";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { API_URL } from "../../../api/api";
import { API_ENDPOINTS, APP_CONFIG } from "../../../constants";
import {
  NoDataFound,
  Table,
  TableBody,
  TableHead,
} from "../../../components/Table/TableComponents";
import { statusOptions } from "../../../constants/orderFilters";
import { formatCurrency, formatDate } from "../../../lib/helpers";

const tableHeaders = [
  "Image",
  "Name",
  //   "Status",
  "Stock",
  //   "Price",
  //   "Category",
  //   "Published",
  "Actions",
];

export default function CreateorderPage() {
  const { data, isLoading, error, refetch } = useAxiosFetch(
    API_URL + API_ENDPOINTS.PRODUCTS
    // params
  );

  const { data: productsData, count, pagination } = data || {};

  return (
    <div className="create-order">
      <div className="create-header">
        <PageTitle title="create Order" icon={<FaFileCirclePlus />} />
        <div>
          <CustomButton
            text="save order"
            icon={<FaFileCirclePlus fontSize="1.25rem" />}
            isTypeSubmit={true}
          />
        </div>
      </div>
      <section className="create-order-section">
        <div>
          <ContentContainer className={"order-form"} title={"order data"}>
            <div className="table-container">
              <Table>
                <TableHead columns={tableHeaders} />
                {/* {isLoading && <TableSkeleton />} */}
                {!isLoading && error && (
                  <NoDataFound
                    message="Error loading orders"
                    onClick={() => window.location.reload()}
                    btnText="Retry"
                    className="error"
                    columnsCount={tableHeaders.length}
                  />
                )}
                {!isLoading && !error && !productsData && (
                  <NoDataFound
                    columns={tableHeaders.length}
                    message="no Products found"
                    columnsCount={tableHeaders.length}
                  />
                )}
                {!isLoading && productsData && (
                  <TableBody>
                    {productsData?.map(
                      ({
                        id,
                        imgUrl: productImg,
                        name: productName,
                        status,
                        createdAt: publishedDate,
                        category,
                        variants,
                      }) => {
                        const { stock, price } = variants[0] || {};
                        const categoryName = category?.name || "Uncategorized";
                        const newStatus = statusOptions.find(
                          (option) => option.value === status
                        );
                        return (
                          <tr className="product-row" key={id}>
                            <td>
                              <img
                                src={productImg}
                                alt={productName}
                                className="product-img"
                              />
                            </td>
                            <td className="name">{productName}</td>
                            <td>{stock}</td>
                            <td className="price">{formatCurrency(price)}</td>

                            <td className="action"></td>
                          </tr>
                        );
                      }
                    )}
                  </TableBody>
                )}
              </Table>
            </div>
          </ContentContainer>
          <ContentContainer className={"order-form"} title={"Shipping data"}>
            <InputContainer
              isFieldRequired={true}
              labelText="shipping address"
              //   errorMsg={errors?.name?.message}
            >
              <input
                type="address"
                // {...register("name", { required: true, maxLength: 25 })}
              />
            </InputContainer>
            <Select
            //   key={selectedCategory} // reset when value changes
            //   value={selectedCategory}
            //   onValueChange={handleCategoryInputChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>

              <SelectContent>
                {/* {isCategoriesLoading && ( */}
                <SelectItem disabled value="loading">
                  Loading...
                </SelectItem>
                {/* )} */}

                {/* {!isCategoriesLoading && categoriesError && ( */}
                <SelectItem disabled value="error">
                  Failed to load payment methods
                </SelectItem>
                {/* )} */}

                {/* {!isCategoriesLoading && */}
                {/* !categoriesError && */}
                {/* categories.length === 0 && ( */}
                <SelectItem disabled value="no-data">
                  No payment methods available
                </SelectItem>
                {/* )} */}

                {/* {!isCategoriesLoading && */}
                {/* !categoriesError && */}
                {/* categories.length > 0 && */}
                {/* categories.map((category) => ( */}
                <SelectItem
                //  key={category.id} value={category.name}
                >
                  {/* {category.name} */}
                </SelectItem>
                {/* ))} */}
              </SelectContent>

              {/* <ErrorMsg errorMsg={errors?.category?.message} /> */}
            </Select>
          </ContentContainer>
        </div>
      </section>
    </div>
  );
}
