def format_inr(number: float) -> str:
    """
    Format a number into Indian Rupee denomination:
    - Below 1 Lakh: ₹XX,XXX
    - 1 Lakh to 99.9 Lakhs: ₹X.XX Lakh
    - 1 Crore and above: ₹X.XX Cr
    """
    if number is None:
        return "₹0"
    
    val = round(float(number))
    if val < 0:
        val = 0

    if val >= 10_000_000:
        return f"₹{val / 10_000_000:.2f} Cr"
    elif val >= 100_000:
        return f"₹{val / 100_000:.2f} Lakh"
    else:
        # Indian comma format for under 1 lakh
        s = str(val)
        if len(s) > 3:
            s = s[:-3] + "," + s[-3:]
        return f"₹{s}"

def format_inr_exact(number: float) -> str:
    """Format exact number with Indian comma grouping."""
    if number is None:
        return "₹0"
    val = round(float(number))
    s = str(val)
    if len(s) <= 3:
        return f"₹{s}"
    last_three = s[-3:]
    remaining = s[:-3]
    parts = []
    while len(remaining) > 2:
        parts.insert(0, remaining[-2:])
        remaining = remaining[:-2]
    if remaining:
        parts.insert(0, remaining)
    return "₹" + ",".join(parts) + "," + last_three
