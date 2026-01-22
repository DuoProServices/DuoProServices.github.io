/**
 * UTILITY TO FIX CORRUPTED TAX FILINGS
 * 
 * This utility fixes tax filings where the `year` field is an object instead of a number
 * Example of corrupted data: { year: { pricingPresetId: "...", year: 2025 } }
 * Should be: { year: 2025 }
 * 
 * NOTE: This calls the backend API to perform the fix operation
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';

/**
 * Fix corrupted tax filings for a specific user
 */
export async function fixUserTaxFilings(userId: string): Promise<{
  success: boolean;
  fixed: number;
  errors: string[];
}> {
  try {
    console.log(`🔧 Calling backend to fix tax filings for user ${userId}...`);

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/fix-tax-filings/${userId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0] || 'Failed to fix tax filings');
    }

    const result = await response.json();

    console.log(`✅ Backend fixed ${result.fixed} tax filings`);

    return {
      success: result.success,
      fixed: result.fixed,
      errors: result.errors || []
    };

  } catch (error) {
    console.error('❌ Error calling fix tax filings API:', error);
    return {
      success: false,
      fixed: 0,
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
}

/**
 * Fix corrupted tax filings for ALL users
 * WARNING: This is a destructive operation. Use with caution.
 */
export async function fixAllUsersTaxFilings(): Promise<{
  totalUsers: number;
  totalFixed: number;
  errors: string[];
}> {
  try {
    console.log('🔧 Calling backend to fix ALL users tax filings...');

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/fix-tax-filings-all`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0] || 'Failed to fix all tax filings');
    }

    const result = await response.json();

    console.log(`\n📊 FINAL RESULTS:`);
    console.log(`   Processed: ${result.totalUsers} users`);
    console.log(`   Fixed: ${result.totalFixed} corrupted filings`);
    console.log(`   Errors: ${result.errors?.length || 0}`);

    return {
      totalUsers: result.totalUsers,
      totalFixed: result.totalFixed,
      errors: result.errors || []
    };

  } catch (error) {
    console.error('❌ Error calling fix all tax filings API:', error);
    return {
      totalUsers: 0,
      totalFixed: 0,
      errors: [error instanceof Error ? error.message : String(error)]
    };
  }
}
