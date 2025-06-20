
-- נוסיף רק את הפונקציות והטריגרים שחסרים
CREATE OR REPLACE FUNCTION public.calculate_deal_payments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE deals
    SET amount_paid = (
        SELECT COALESCE(SUM(amount), 0)
        FROM payments
        WHERE deal_id = COALESCE(NEW.deal_id, OLD.deal_id)
    ),
    updated_at = NOW()
    WHERE id = COALESCE(NEW.deal_id, OLD.deal_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- פונקציה לעדכון סטטוס תשלום
CREATE OR REPLACE FUNCTION public.update_deal_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE deals
    SET payment_status = CASE
        WHEN amount_paid >= amount_total THEN 'paid'
        WHEN amount_paid > 0 AND amount_paid < amount_total THEN 'partial'
        ELSE 'pending'
    END,
    updated_at = NOW()
    WHERE id = NEW.deal_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- יצירת triggers (אם לא קיימים)
DROP TRIGGER IF EXISTS payment_calculate_trigger ON payments;
CREATE TRIGGER payment_calculate_trigger
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION calculate_deal_payments();

DROP TRIGGER IF EXISTS payment_status_trigger ON deals;
CREATE TRIGGER payment_status_trigger
    AFTER UPDATE ON deals
    FOR EACH ROW
    WHEN (OLD.amount_paid IS DISTINCT FROM NEW.amount_paid)
    EXECUTE FUNCTION update_deal_payment_status();
