import "./FormContainer.css";

import Logo from "../Navigation/Logo";
import GoBack from "../Navigation/GoBack";

export default function FormContainer({
  children,
  headingTitle,
  headingIcon,
  headingText,
  footer,
}) {
  return (
    <div className="form__container">
      <div className="form__card">
        <header className="form__navigation">
          <span className="form__navigation-goback">
            <GoBack />
          </span>
          <h1 className="form__navigation-heading">
            {headingTitle}
            {headingIcon}
          </h1>
          <Logo />
        </header>

        <p className="form__text">{headingText}</p>
        {children}
        <p className="form__container-footer">{footer}</p>
      </div>
    </div>
  );
}
