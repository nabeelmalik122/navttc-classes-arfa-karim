import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Award,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  GraduationCap,
  Building2,
  CheckCircle2,
  FileCheck2,
  RotateCcw,
  Loader2,
  X,
  FileText,
  UserCheck
} from 'lucide-react';

export default function App() {
  // Registered admission entries state
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Password toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast Notification state
  const [notification, setNotification] = useState(null);

  // Form serial number generator
  const [formSerial] = useState(() => `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const passwordValue = watch('password');

  // Helper to extract initials for stamp avatar
  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Submit Handler with 3-second loading state
  const onSubmit = (data) => {
    setIsLoading(true);

    setTimeout(() => {
      const formattedDate = data.dob
        ? data.dob.split('-').reverse().join('/')
        : 'N/A';

      const serialNo = `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newEntry = {
        id: Date.now(),
        serialNo,
        studentName: data.studentName,
        fatherName: data.fatherName,
        email: data.email,
        phone: data.phone,
        dob: formattedDate,
        gender: data.gender,
        course: data.course,
        city: data.city,
        address: data.address,
        initials: getInitials(data.studentName)
      };

      setEntries((prev) => [newEntry, ...prev]);
      reset();
      setIsLoading(false);

      // Trigger Toast
      setNotification({
        title: 'Official Admission Registered',
        message: `Admission slip for "${data.studentName}" has been issued as ${serialNo}.`
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }, 3000);
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div className="toast-notification">
          <CheckCircle2 size={22} color="#A9812F" />
          <div className="toast-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
          <button
            className="toast-close"
            onClick={() => setNotification(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Document Wrapper */}
      <div className="document-wrapper">
        {/* Letterhead Header Card */}
        <div className="letterhead-card">
          <header className="letterhead-top">
            <div className="institution-brand">
              <div className="crest-box">
                <Award size={30} />
              </div>
              <div className="institution-titles">
                <h1>Academic Admissions Registry</h1>
                <p>Office of the Registrar • Student Enrollment Division</p>
              </div>
            </div>

            <div className="serial-badge">
              <span>Form Serial No.</span>
              <strong>{formSerial}</strong>
            </div>
          </header>

          <div className="document-sub-title">
            <FileText size={20} color="#A9812F" />
            Official Application for Student Registration
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Section I: Personal Details */}
            <div className="form-section-block">
              <h2 className="section-numeral-title">
                <span className="numeral-tag">I.</span> Personal Details
              </h2>

              <div className="fields-grid">
                {/* Student Name */}
                <div className="form-field">
                  <label className="field-label">
                    Student Name <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <User className="field-icon" size={17} />
                    <input
                      type="text"
                      className={`underline-input ${errors.studentName ? 'has-error' : ''}`}
                      placeholder="e.g. Ali Khan"
                      {...register('studentName', {
                        required: 'Student Name is required',
                        minLength: {
                          value: 3,
                          message: 'Name must be at least 3 characters'
                        }
                      })}
                    />
                  </div>
                  {errors.studentName && (
                    <span className="error-text">{errors.studentName.message}</span>
                  )}
                </div>

                {/* Father Name */}
                <div className="form-field">
                  <label className="field-label">
                    Father Name <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <User className="field-icon" size={17} />
                    <input
                      type="text"
                      className={`underline-input ${errors.fatherName ? 'has-error' : ''}`}
                      placeholder="e.g. Tariq Khan"
                      {...register('fatherName', {
                        required: 'Father Name is required'
                      })}
                    />
                  </div>
                  {errors.fatherName && (
                    <span className="error-text">{errors.fatherName.message}</span>
                  )}
                </div>

                {/* Email Address */}
                <div className="form-field">
                  <label className="field-label">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <Mail className="field-icon" size={17} />
                    <input
                      type="email"
                      className={`underline-input ${errors.email ? 'has-error' : ''}`}
                      placeholder="student@example.com"
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-text">{errors.email.message}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="form-field">
                  <label className="field-label">
                    Contact Phone <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <Phone className="field-icon" size={17} />
                    <input
                      type="tel"
                      className={`underline-input ${errors.phone ? 'has-error' : ''}`}
                      placeholder="03XX-XXXXXXX"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^03\d{2}-?\d{7}$/,
                          message: 'Format must be e.g. 0311-2345678'
                        }
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <span className="error-text">{errors.phone.message}</span>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="form-field">
                  <label className="field-label">
                    Date of Birth <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <Calendar className="field-icon" size={17} />
                    <input
                      type="date"
                      className={`underline-input ${errors.dob ? 'has-error' : ''}`}
                      {...register('dob', {
                        required: 'Date of birth is required'
                      })}
                    />
                  </div>
                  {errors.dob && (
                    <span className="error-text">{errors.dob.message}</span>
                  )}
                </div>

                {/* Gender */}
                <div className="form-field">
                  <label className="field-label">
                    Gender <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <User className="field-icon" size={17} />
                    <select
                      className={`underline-input ${errors.gender ? 'has-error' : ''}`}
                      {...register('gender', {
                        required: 'Gender selection is required'
                      })}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <span className="error-text">{errors.gender.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section II: Academic Details */}
            <div className="form-section-block">
              <h2 className="section-numeral-title">
                <span className="numeral-tag">II.</span> Academic Details
              </h2>

              <div className="fields-grid">
                {/* Course Selection */}
                <div className="form-field">
                  <label className="field-label">
                    Selected Course <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <GraduationCap className="field-icon" size={17} />
                    <select
                      className={`underline-input ${errors.course ? 'has-error' : ''}`}
                      {...register('course', {
                        required: 'Course selection is required'
                      })}
                    >
                      <option value="">Select program course</option>
                      <option value="React JS">React JS</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Python">Python</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile App Dev">Mobile App Dev</option>
                    </select>
                  </div>
                  {errors.course && (
                    <span className="error-text">{errors.course.message}</span>
                  )}
                </div>

                {/* City Selection */}
                <div className="form-field">
                  <label className="field-label">
                    City of Residence <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <Building2 className="field-icon" size={17} />
                    <select
                      className={`underline-input ${errors.city ? 'has-error' : ''}`}
                      {...register('city', {
                        required: 'City selection is required'
                      })}
                    >
                      <option value="">Select city</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Multan">Multan</option>
                      <option value="Faisalabad">Faisalabad</option>
                    </select>
                  </div>
                  {errors.city && (
                    <span className="error-text">{errors.city.message}</span>
                  )}
                </div>

                {/* Residential Address */}
                <div className="form-field full-width">
                  <label className="field-label">
                    Residential Address <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <MapPin className="field-icon" size={17} />
                    <input
                      type="text"
                      className={`underline-input ${errors.address ? 'has-error' : ''}`}
                      placeholder="Enter complete residential street address"
                      {...register('address', {
                        required: 'Address is required'
                      })}
                    />
                  </div>
                  {errors.address && (
                    <span className="error-text">{errors.address.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section III: Account Security */}
            <div className="form-section-block">
              <h2 className="section-numeral-title">
                <span className="numeral-tag">III.</span> Account Security
              </h2>

              <div className="fields-grid">
                {/* Password */}
                <div className="form-field">
                  <label className="field-label">
                    Password <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <Lock className="field-icon" size={17} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`underline-input ${errors.password ? 'has-error' : ''}`}
                      placeholder="Minimum 6 characters"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="pwd-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-text">{errors.password.message}</span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-field">
                  <label className="field-label">
                    Confirm Password <span className="required-star">*</span>
                  </label>
                  <div className="underline-wrapper">
                    <Lock className="field-icon" size={17} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`underline-input ${errors.confirmPassword ? 'has-error' : ''}`}
                      placeholder="Re-type password"
                      {...register('confirmPassword', {
                        required: 'Please confirm password',
                        validate: (val) =>
                          val === passwordValue || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      className="pwd-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword.message}</span>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="terms-row">
                <input
                  type="checkbox"
                  {...register('terms', {
                    required: 'You must affirm to the admission terms'
                  })}
                />
                <span>I affirm that all provided information is accurate and truthful.</span>
              </label>
              {errors.terms && (
                <span className="error-text" style={{ display: 'block', marginTop: '0.3rem' }}>
                  {errors.terms.message}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-stamp"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="spinner" /> Processing (3 Seconds)...
                  </>
                ) : (
                  <>
                    <FileCheck2 size={18} /> Submit Official Admission
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-clear"
                onClick={() => reset()}
                disabled={isLoading}
              >
                <RotateCcw size={16} /> Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Registered Entries Display: Admission Slips */}
        <section className="entries-container">
          <h2 className="entries-title">
            <UserCheck size={22} color="#A9812F" />
            Issued Admission Slips ({entries.length})
          </h2>

          {entries.length === 0 ? (
            <div className="empty-slip-state">
              <FileText size={38} color="#A9812F" style={{ opacity: 0.6 }} />
              <h3>No Admission Slips Issued Yet</h3>
              <p>Complete the ledger form above to register an official student admission entry.</p>
            </div>
          ) : (
            <div className="slips-list">
              {entries.map((entry) => (
                <div key={entry.id} className="admission-slip-row">
                  <div className="slip-left">
                    <div className="stamp-avatar">{entry.initials}</div>
                    <div className="slip-main">
                      <h3>{entry.studentName}</h3>
                      <span className="slip-course-tag">{entry.course}</span>
                    </div>
                  </div>

                  <div className="slip-details">
                    <div className="slip-detail-item">
                      <Mail size={14} color="#A9812F" />
                      <span>{entry.email}</span>
                    </div>
                    <div className="slip-detail-item">
                      <Phone size={14} color="#A9812F" />
                      <span>{entry.phone}</span>
                    </div>
                    <div className="slip-detail-item">
                      <Building2 size={14} color="#A9812F" />
                      <span>{entry.city}</span>
                    </div>
                    <div className="slip-detail-item">
                      <Calendar size={14} color="#A9812F" />
                      <span>{entry.dob}</span>
                    </div>
                  </div>

                  <div className="slip-right-serial">
                    {entry.serialNo}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Document Footer */}
      <footer className="document-footer">
        🏛️ Academic Ledger System • Official Enrollment Registry • Built with React & React Hook Form
      </footer>
    </div>
  );
}
