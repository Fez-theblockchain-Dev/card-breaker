import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBreakingSession } from '../lib/database';
import { useState } from 'react';

const sessionSchema = z.object({
  packageCost: z.number()
    .min(0, 'Cost cannot be negative')
    .max(100000, 'Cost cannot exceed $100,000'),
  timeSpent: z.number()
    .min(0, 'Time cannot be negative')
    .max(24, 'Time cannot exceed 24 hours'),
  salesPrice: z.number()
    .min(0, 'Sales price cannot be negative')
    .max(1000000, 'Sales price cannot exceed $1,000,000'),
  buyer: z.string()
    .min(2, 'Buyer name must be at least 2 characters')
    .max(100, 'Buyer name cannot exceed 100 characters'),
  paymentMethod: z.string()
    .min(1, 'Payment method is required')
    .max(50, 'Payment method cannot exceed 50 characters')
});

type SessionForm = z.infer<typeof sessionSchema>;

export const Route = createFileRoute('/session')({
  component: SessionPage,
});

function SessionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      packageCost: 0,
      timeSpent: 0,
      salesPrice: 0,
      buyer: '',
      paymentMethod: ''
    }
  });

  const onSubmit = async (data: SessionForm) => {
    setIsSubmitting(true);
    try {
      await createBreakingSession(data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating breaking session:', error);
      alert('There was an error logging your session. Please make sure you are signed in and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 neon-text">Log Breaking Session</h1>
      
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg">
          Session logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div>
          <label htmlFor="packageCost" className="block mb-2 neon-text">
            Cost of Package ($)
          </label>
          <input
            {...register('packageCost', { valueAsNumber: true })}
            type="number"
            id="packageCost"
            step="0.01"
            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-neon-orange"
          />
          {errors.packageCost && (
            <p className="mt-1 text-red-500">{errors.packageCost.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="salesPrice" className="block mb-2 neon-text">
            Sales Price ($)
          </label>
          <input
            {...register('salesPrice', { valueAsNumber: true })}
            type="number"
            id="salesPrice"
            step="0.01"
            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-neon-orange"
          />
          {errors.salesPrice && (
            <p className="mt-1 text-red-500">{errors.salesPrice.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="timeSpent" className="block mb-2 neon-text">
            Time Spent Breaking (hours)
          </label>
          <input
            {...register('timeSpent', { valueAsNumber: true })}
            type="number"
            id="timeSpent"
            step="0.5"
            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-neon-orange"
          />
          {errors.timeSpent && (
            <p className="mt-1 text-red-500">{errors.timeSpent.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="buyer" className="block mb-2 neon-text">
            Buyer Name
          </label>
          <input
            {...register('buyer')}
            type="text"
            id="buyer"
            placeholder="Enter buyer's name"
            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-neon-orange"
          />
          {errors.buyer && (
            <p className="mt-1 text-red-500">{errors.buyer.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block mb-2 neon-text">
            Payment Method
          </label>
          <input
            {...register('paymentMethod')}
            type="text"
            id="paymentMethod"
            placeholder="e.g., Venmo, Cash App, Zelle"
            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-neon-orange"
          />
          {errors.paymentMethod && (
            <p className="mt-1 text-red-500">{errors.paymentMethod.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-[var(--neon-orange)] text-white rounded-md hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Logging Session...' : 'Log Session'}
        </button>
      </form>
    </div>
  );
}