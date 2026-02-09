import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Wallet, Loader2, AlertCircle } from 'lucide-react';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  onWithdraw: (amount: number, upiId: string) => Promise<{ error: Error | null }>;
  withdrawing: boolean;
}

export function WithdrawalDialog({
  open,
  onOpenChange,
  walletBalance,
  onWithdraw,
  withdrawing,
}: WithdrawalDialogProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    setError('');

    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawAmount < 100) {
      setError('Minimum withdrawal amount is ₹100');
      return;
    }

    if (withdrawAmount > walletBalance) {
      setError('Insufficient balance');
      return;
    }

    if (!upiId || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., name@upi)');
      return;
    }

    const result = await onWithdraw(withdrawAmount, upiId);
    
    if (!result.error) {
      setAmount('');
      setUpiId('');
      onOpenChange(false);
    }
  };

  const quickAmounts = [100, 500, 1000, Math.floor(walletBalance)].filter(
    (a, i, arr) => a <= walletBalance && arr.indexOf(a) === i && a > 0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {t('worker.withdraw')}
          </DialogTitle>
          <DialogDescription>
            Instantly withdraw to your UPI account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Available Balance */}
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{walletBalance.toLocaleString()}
            </p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={100}
              max={walletBalance}
            />
            
            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* UPI ID Input */}
          <div className="space-y-2">
            <Label htmlFor="upi">UPI ID</Label>
            <Input
              id="upi"
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Money will be transferred instantly to this UPI ID
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={withdrawing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={withdrawing || !amount || !upiId}
            className="bg-green-600 hover:bg-green-700"
          >
            {withdrawing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Withdraw ₹${amount || '0'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
