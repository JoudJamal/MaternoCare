# backend/ai_summarizer.py
# Offline dummy summarizer – NO OpenAI calls.

def summarize_patient_explanation(explanation: dict) -> str:
    """
    Build a short plain-text summary from the numeric info only.
    This lets you test SHAP + front-end without using the OpenAI API.
    """
    risk = explanation.get("risk_class", "Unknown")
    hq = explanation.get("hq")
    cr = explanation.get("cr")

    parts = [f"Overall model classification: {risk} PCB-related risk."]

    if hq is not None:
        try:
            parts.append(f"Non-cancer hazard index (HQ) ≈ {float(hq):.3g}.")
        except Exception:
            pass

    if cr is not None:
        try:
            parts.append(f"Lifetime cancer risk estimate (CR) ≈ {float(cr):.3g}.")
        except Exception:
            pass

    drivers = explanation.get("main_drivers") or []
    if drivers:
        top = ", ".join(
            f"{d['feature']} (impact {d['impact']:.3g})"
            for d in drivers
        )
        parts.append(f"Key drivers in this pregnancy: {top}.")

    parts.append(
        "This explanation is auto-generated from a PCB risk model and is "
        "for research/screening only, not a definitive clinical diagnosis."
    )

    return " ".join(parts)
