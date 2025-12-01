import React from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function PasswordField({ label = "Password", value, onChange }) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <TextField
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      // name="password"
      onChange={onChange}
      fullWidth
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
