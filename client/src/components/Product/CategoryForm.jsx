import "./CategoryForm.css";

import { RiAddCircleLine } from "react-icons/ri";
import { MdFormatListBulletedAdd } from "react-icons/md";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import CustomButton from "@/components/Buttons/CustomButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import InputContainer from "../Forms/InputContainer";

const CategoryForm = ({
  categories,
  selectedCategory,
  handleAddNewCategory,
  setNewCategory,
  handleCategoryInputChange,
  onSetOpenCategoryDialog,
  openCategoryDialog,
  isEditSession,
  editDefaultValues,
}) => {
  return (
    <>
      <header>
        <Dialog
          open={openCategoryDialog}
          onOpenChange={onSetOpenCategoryDialog}
        >
          <DialogTrigger asChild>
            <button>
              <RiAddCircleLine /> Add Category
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle className="font-extrabold">
              Create New Category
            </DialogTitle>

            <DialogDescription>
              Create a new category to better organize your products.
            </DialogDescription>

            <InputContainer>
              <input
                className="category-form__input"
                type="text"
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </InputContainer>

            <DialogFooter>
              <CustomButton
                icon={<MdFormatListBulletedAdd fontSize={"1.4rem"} />}
                text="add Category"
                onClick={handleAddNewCategory}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <Select
        defaultValue={isEditSession ? editDefaultValues.category : ""}
        onValueChange={handleCategoryInputChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories &&
            categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default CategoryForm;
