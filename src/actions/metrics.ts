
'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function getDashboardMetrics() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'User not authenticated.',
      data: { totalSpent: 0, totalEarned: 0, profitLoss: 0, collectionSize: 0, budget: { limit: 0, spent: 0, remaining: 0 } },
    };
  }

  try {
    const [transactionsRes, stampsCountRes, budgetRes] = await Promise.all([
        supabase.from('transactions').select('type, amount').eq('user_id', user.id),
        supabase.from('stamps').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('budgets').select('limit, spent').eq('user_id', user.id).single(),
    ]);

    if (transactionsRes.error) throw transactionsRes.error;
    if (stampsCountRes.error) throw stampsCountRes.error;
    if (budgetRes.error && budgetRes.error.code !== 'PGRST116') throw budgetRes.error; // Ignore no rows found

    const transactions = transactionsRes.data || [];
    const totalSpent = transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0);
    const totalEarned = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
    const profitLoss = totalEarned - totalSpent;

    const collectionSize = stampsCountRes.count ?? 0;

    const budgetData = budgetRes.data ? {
        limit: budgetRes.data.limit,
        spent: budgetRes.data.spent,
        remaining: budgetRes.data.limit - budgetRes.data.spent,
    } : { limit: 0, spent: 0, remaining: 0 };

    return {
      success: true,
      data: {
        totalSpent,
        totalEarned,
        profitLoss,
        collectionSize,
        budget: budgetData,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      success: false,
      message: 'Failed to fetch dashboard metrics.',
      data: { totalSpent: 0, totalEarned: 0, profitLoss: 0, collectionSize: 0, budget: { limit: 0, spent: 0, remaining: 0 } },
    };
  }
}
