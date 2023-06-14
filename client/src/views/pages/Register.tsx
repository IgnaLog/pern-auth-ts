import { useState, ChangeEvent, ClipboardEvent } from "react";
import * as Yup from "yup";
import { registerRequest } from "../../api/authService";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import {
  faCheck,
  faTimes,
  faEye,
  faEyeSlash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required.")
    .min(4, "Username must have a minimum of 4 characters.")
    .max(24, "Username too long.")
    .matches(
      /^[A-z][A-z0-9-_]{3,23}$/,
      "Must begin with a letter. Letters, number, underscores, hyphens allowed."
    ),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must have a minimum of 8 characters.")
    .max(24, "Password too long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
      " Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: ! @ # $ %"
    ),
  confirm_pwd: Yup.string()
    .required("Confirm password is required.")
    .oneOf([Yup.ref("password")], "Passwords don't match"),
});

type FormValues = {
  username: string;
  password: string;
  confirm_pwd: string;
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const initialValues: FormValues = {
    username: "",
    password: "",
    confirm_pwd: "",
  };

  const togglePasswordVisibility = (field: string) => () => {
    field === "password"
      ? setShowPassword(!showPassword)
      : setShowConfirmPwd(!showConfirmPwd);
  };

  const preventDefaultPaste = () => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  // Overriding formik's handleChange function
  const customHandleChange =
    (handleChangeFn: (e: ChangeEvent<any>) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChangeFn(e);
      setServerMsg("");
    };

  const handleSubmit = async (
    values: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      await registerRequest(values);
      resetForm();
      setSuccess(true);
    } catch (err: any) {
      if (!err?.response) {
        setServerMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setServerMsg("Username Taken");
        resetForm({
          values: {
            ...values,
            username: "",
          },
        });
      } else {
        setServerMsg("Registration Failed");
        resetForm({
          values: {
            ...values,
            password: "",
            confirm_pwd: "",
          },
        });
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/login">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <h1>Register</h1>
          {/* SERVER INFO */}
          {serverMsg && <p className="errmsg">{serverMsg}</p>}
          <Formik
            initialValues={initialValues}
            validationSchema={signupSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, handleChange }) => (
              <Form>
                {/* USERNAME */}
                <label htmlFor="username">
                  Username:
                  {touched.username && !errors.username && (
                    <FontAwesomeIcon icon={faCheck} className="valid" />
                  )}
                  {touched.username && errors.username && (
                    <FontAwesomeIcon icon={faTimes} className="invalid" />
                  )}
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={customHandleChange(handleChange)}
                  autoComplete="off"
                />
                <ErrorMessage name="username" component="p">
                  {(errorMsg) => (
                    <div className="instructions">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </ErrorMessage>

                {/* PASSWORD */}
                <label htmlFor="password">
                  Contraseña:
                  {touched.password && !errors.password && (
                    <FontAwesomeIcon icon={faCheck} className="valid" />
                  )}
                  {touched.password && errors.password && (
                    <FontAwesomeIcon icon={faTimes} className="invalid" />
                  )}
                </label>
                <div className="controlPwd">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={customHandleChange(handleChange)}
                    autoComplete="off"
                    className="inputPwd"
                  />
                  <i
                    onClick={togglePasswordVisibility("password")}
                    className="iconEye"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </i>
                </div>
                <ErrorMessage name="password" component="p">
                  {(errorMsg) => (
                    <div className="instructions">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </ErrorMessage>

                {/* CONFIRM_PWD */}
                <label htmlFor="confirm_pwd">
                  Confirm Password:
                  {touched.confirm_pwd && !errors.confirm_pwd && (
                    <FontAwesomeIcon icon={faCheck} className="valid" />
                  )}
                  {touched.confirm_pwd && errors.confirm_pwd && (
                    <FontAwesomeIcon icon={faTimes} className="invalid" />
                  )}
                </label>
                <div className="controlPwd">
                  <Field
                    type={showConfirmPwd ? "text" : "password"}
                    id="confirm_pwd"
                    name="confirm_pwd"
                    value={values.confirm_pwd}
                    onChange={customHandleChange(handleChange)}
                    autoComplete="off"
                    className="inputPwd"
                    onPaste={preventDefaultPaste()}
                  />
                  <span
                    onClick={togglePasswordVisibility("confirm")}
                    className="iconEye"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPwd ? faEyeSlash : faEye}
                    />
                  </span>
                </div>

                <ErrorMessage name="confirm_pwd" component="p">
                  {(errorMsg) => (
                    <div className="instructions">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </ErrorMessage>

                {/* BUTTON SUBMITTING */}
                <button type="submit" disabled={isSubmitting}>
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
          <p>
            Already registered?
            <br />
            <span className="line">
              <a href="/login">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
