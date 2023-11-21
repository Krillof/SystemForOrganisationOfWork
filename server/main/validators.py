from django.core.exceptions import ValidationError

def validate_password(value):
  if len(value) == 0:
    raise ValidationError("Password can't have zero length", params={"password":value})
  if len(value) >= 10:
    raise ValidationError("Password is too long - it's maximum length is 10", params={"password":value})
  if not any(c.isnumeric() for c in value):
    raise ValidationError("Password must contain at least one number", params={"password":value})
  if not any(c.isalpha() for c in value):
    raise ValidationError("Password must contain at least one letter", params={"password":value})
  

def validate_login(value):
  if len(value) == 0:
    raise ValidationError("Login can't have zero length", params={"password":value})
  if len(value) >= 10:
    raise ValidationError("Login is too long - it's maximum length is 10", params={"password":value})
  