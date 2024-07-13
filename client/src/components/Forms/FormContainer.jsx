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
    <div className="form-container">
      <div className="form-card">
        <header className="form-navigation">
          <span className="form-navigation-goback">
            <GoBack />
          </span>
          <h1 className="form-navigation-heading">
            {headingTitle}
            {headingIcon}
          </h1>
          <Logo />
        </header>

        <p className="form-text">{headingText}</p>
        {children}
        <p className="form-container-footer">{footer}</p>
      </div>
    </div>
  );
}
