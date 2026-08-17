const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;

export function validateName(value) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "Name is required";
  }

  if (trimmed.length < 20 || trimmed.length > 60) {
    return "Name must be between 20 and 60 characters";
  }

  return "";
}

export function validateEmail(value) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "A valid email address is required";
  }

  return "";
}

export function validatePassword(value) {
  if (!value) {
    return "Password is required";
  }

  if (value.length < 8 || value.length > 16) {
    return "Password must be between 8 and 16 characters";
  }

  if (!PASSWORD_REGEX.test(value)) {
    return "Password must contain at least one uppercase letter and one special character (!@#$%^&*)";
  }

  return "";
}

export function validateAddress(value) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "Address is required";
  }

  if (trimmed.length > 400) {
    return "Address must not exceed 400 characters";
  }

  return "";
}

export function validateLoginPassword(value) {
  if (!value) {
    return "Password is required";
  }

  return "";
}

export function getRoleHome(role) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "STORE_OWNER":
      return "/owner/dashboard";
    case "USER":
    default:
      return "/user/stores";
  }
}
