import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import lottie from 'lottie-web';
import './ContactForm.scss';

const ContactForm = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [formData, setFormData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showIntermediateAnimation, setShowIntermediateAnimation] = useState(false);
  const [showFormBox, setShowFormBox] = useState(true);

  const animationContainer = useRef(null);
  const intermediateAnimationContainer = useRef(null);

  const onSubmit = (data) => {
    setShowFormBox(false);
    setShowIntermediateAnimation(true);

    setTimeout(() => {
      setShowIntermediateAnimation(false);
      setShowFormBox(true);
      setFormData(data);
      setFormSubmitted(true);
    }, 2500);
  };

  const applyTestData = () => {
    setValue("fullName", "Test Name");
    setValue("phoneNumber", "71 90 75 48");
    setValue("email", "test@email.com");
    setValue("comment", "Test Comment");
    setValue("contactMethod", "email");
  };

  const goBackToForm = () => {
    setFormSubmitted(false);
    setFormData(null);
    reset();
  };

  const onReset = () => {
    reset();
  };

  useEffect(() => {
    let anim;
    if (showIntermediateAnimation) {
      anim = lottie.loadAnimation({
        container: intermediateAnimationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'sending.json'
      });
    } else if (formSubmitted) {
      anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'success.json'
      });
    }

    return () => anim && anim.destroy();
  }, [showIntermediateAnimation, formSubmitted]);

  return (
    <div className="container">
      <div ref={intermediateAnimationContainer} className={`intermediate-lottie-container ${showIntermediateAnimation ? 'fade-in' : 'fade-out'}`}></div>
      <div className={`form-box ${showFormBox ? 'fade-in' : 'fade-out'}`}>
        {formSubmitted ? (
          <>
              <div ref={animationContainer} className="lottie-container"></div>
              <div className="success-content">
                <p>The following data was submitted:</p>
                <ul>
                  <li><strong>Full Name:</strong> {formData.fullName}</li>
                  <li><strong>Phone:</strong> {formData.phoneNumber}</li>
                  <li><strong>Email:</strong> {formData.email}</li>
                  <li><strong>Comment:</strong> {formData.comment}</li>
                  <li><strong>Contact Method:</strong> {formData.contactMethod}</li>
                </ul>
              </div>
              <button onClick={goBackToForm} className="go-back-button">Go Back</button>
            </>
          ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="field-label">Full Name</label>
          <input
            {...register('fullName', {
                required: 'This field is required',
                validate: value => value.includes('kasper') ? 'Oh no... not you again.' : true
              })}
            className="input-field"
          />
          {errors.fullName && <div className="error-box">{errors.fullName.message}</div>}

          <label className="field-label">Phone Number</label>
          <input
            {...register('phoneNumber', {
              required: 'This field is required',
              pattern: { value: /^(\d{2}[-.\s]?){3}\d{2}$/, message: 'Invalid phone number' },
            })}
            className="input-field"
          />
          {errors.phoneNumber && <div className="error-box">{errors.phoneNumber.message}</div>}

          <label className="field-label">Email</label>
          <input
            type="email"
            {...register('email', { required: 'This field is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' } })}
            className="input-field"
          />
          {errors.email && <div className="error-box">{errors.email.message}</div>}

          <label className="field-label">Comment</label>
          <textarea
            {...register('comment', { required: 'This field is required', maxLength: { value: 400, message: 'Comment is too long' } })}
            className="input-field"
            rows="4"
            maxLength="400"
            style={{ resize: 'none' }}
          ></textarea>
          {errors.comment && <div className="error-box">{errors.comment.message}</div>}

          <label className="field-label">How should we contact you?</label>
          <select {...register('contactMethod', { required: 'This field is required' })} className="input-field">
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
          {errors.contactMethod && <div className="error-box">{errors.contactMethod.message}</div>}

          <button type="submit">Send</button>
          <button type="button" onClick={onReset}>Reset</button>
          <button type="button" onClick={applyTestData}>Apply Test Data</button>
        </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
