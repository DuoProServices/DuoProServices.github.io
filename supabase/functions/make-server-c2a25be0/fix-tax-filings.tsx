import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

export const fixTaxFilingsApp = new Hono();

interface TaxFiling {
  year: any; // Can be number or object (corrupted)
  status: string;
  createdAt: string;
  updatedAt: string;
  payment?: any;
  [key: string]: any;
}

/**
 * Fix corrupted tax filings for a specific user
 * Route: POST /make-server-c2a25be0/fix-tax-filings/:userId
 */
fixTaxFilingsApp.post('/make-server-c2a25be0/fix-tax-filings/:userId', async (c) => {
  const userId = c.req.param('userId');
  const errors: string[] = [];
  let fixedCount = 0;

  try {
    console.log(`🔧 Starting fix for user ${userId}...`);

    // Get user data from KV store
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      console.error(`❌ User not found in KV store: ${userId}`);
      return c.json({ 
        success: false,
        fixed: 0,
        errors: [`User not found: ${userId}`]
      }, 404);
    }

    const taxFilings: TaxFiling[] = userData.taxFilings || [];

    if (taxFilings.length === 0) {
      console.log('✅ No tax filings to fix');
      return c.json({ 
        success: true, 
        fixed: 0, 
        errors: [] 
      });
    }

    console.log(`📋 Found ${taxFilings.length} tax filings for ${userData.name}`);

    // Fix corrupted filings
    const fixedFilings = taxFilings.map((filing, index) => {
      // Check if year is an object (corrupted)
      if (typeof filing.year === 'object' && filing.year !== null) {
        console.warn(`⚠️ Found corrupted filing at index ${index}:`, filing);
        
        // Extract the actual year from the nested object
        const actualYear = filing.year.year;
        
        if (typeof actualYear === 'number') {
          console.log(`✅ Fixing: Extracting year ${actualYear} from object`);
          fixedCount++;
          
          // Create fixed filing
          const fixed = {
            ...filing,
            year: actualYear, // Extract the number
          };
          
          // If pricingPresetId was in the nested year object, preserve it in payment
          if (filing.year.pricingPresetId && !filing.payment) {
            fixed.payment = {
              ...filing.payment,
              pricingPresetId: filing.year.pricingPresetId,
              status: 'pending',
              amount: 0,
              currency: 'CAD',
              createdAt: filing.createdAt
            };
          }
          
          return fixed;
        } else {
          errors.push(`Filing at index ${index} has invalid year: ${JSON.stringify(filing.year)}`);
          return null; // Mark for removal
        }
      }
      
      // Check if year is a valid number
      if (typeof filing.year !== 'number' || isNaN(filing.year)) {
        console.warn(`⚠️ Invalid year type at index ${index}:`, typeof filing.year, filing.year);
        errors.push(`Filing at index ${index} has invalid year type: ${typeof filing.year}`);
        return null; // Mark for removal
      }
      
      // Filing is valid
      return filing;
    });

    // Remove null entries (invalid filings)
    const validFilings = fixedFilings.filter(f => f !== null);

    console.log(`📊 Results: ${validFilings.length} valid filings, ${fixedCount} fixed, ${errors.length} errors`);

    if (fixedCount > 0 || validFilings.length !== taxFilings.length) {
      // Update user data in KV store
      const updatedUserData = {
        ...userData,
        taxFilings: validFilings
      };

      await kv.set(`user:${userId}`, updatedUserData);

      console.log(`✅ Successfully updated user ${userId} (${userData.name}) with ${validFilings.length} valid filings`);
    }

    return c.json({
      success: true,
      fixed: fixedCount,
      errors,
      totalFilings: validFilings.length
    });

  } catch (error) {
    console.error('❌ Error fixing tax filings:', error);
    errors.push(error instanceof Error ? error.message : String(error));
    return c.json({
      success: false,
      fixed: fixedCount,
      errors
    }, 500);
  }
});

/**
 * Fix corrupted tax filings for ALL users
 * Route: POST /make-server-c2a25be0/fix-tax-filings/all
 */
fixTaxFilingsApp.post('/make-server-c2a25be0/fix-tax-filings-all', async (c) => {
  let totalFixed = 0;
  const allErrors: string[] = [];
  let processedUsers = 0;

  try {
    console.log('🔧 Starting fix for ALL users...');

    // Get all users from KV store
    const userKeys = await kv.getByPrefix('user:');

    if (!userKeys || userKeys.length === 0) {
      console.log('✅ No users found');
      return c.json({ 
        totalUsers: 0, 
        totalFixed: 0, 
        errors: [] 
      });
    }

    console.log(`📋 Found ${userKeys.length} users to process`);

    // Process each user
    for (const userKey of userKeys) {
      const userData = userKey.value;
      if (!userData || !userData.id) continue;

      const taxFilings: TaxFiling[] = userData.taxFilings || [];
      
      if (taxFilings.length === 0) {
        processedUsers++;
        continue;
      }

      let userFixedCount = 0;
      const userErrors: string[] = [];

      // Fix corrupted filings for this user
      const fixedFilings = taxFilings.map((filing, index) => {
        if (typeof filing.year === 'object' && filing.year !== null) {
          const actualYear = filing.year.year;
          
          if (typeof actualYear === 'number') {
            userFixedCount++;
            const fixed = {
              ...filing,
              year: actualYear,
            };
            
            if (filing.year.pricingPresetId && !filing.payment) {
              fixed.payment = {
                pricingPresetId: filing.year.pricingPresetId,
                status: 'pending',
                amount: 0,
                currency: 'CAD',
                createdAt: filing.createdAt
              };
            }
            
            return fixed;
          } else {
            userErrors.push(`User ${userData.email}: Filing at index ${index} has invalid year`);
            return null;
          }
        }
        
        if (typeof filing.year !== 'number' || isNaN(filing.year)) {
          userErrors.push(`User ${userData.email}: Filing at index ${index} has invalid year type`);
          return null;
        }
        
        return filing;
      });

      const validFilings = fixedFilings.filter(f => f !== null);

      if (userFixedCount > 0 || validFilings.length !== taxFilings.length) {
        const updatedUserData = {
          ...userData,
          taxFilings: validFilings
        };

        await kv.set(`user:${userData.id}`, updatedUserData);
        
        if (userFixedCount > 0) {
          console.log(`✅ User ${userData.email}: Fixed ${userFixedCount} filings`);
        }
      }

      processedUsers++;
      totalFixed += userFixedCount;
      allErrors.push(...userErrors);
    }

    console.log(`\n📊 FINAL RESULTS:`);
    console.log(`   Processed: ${processedUsers} users`);
    console.log(`   Fixed: ${totalFixed} corrupted filings`);
    console.log(`   Errors: ${allErrors.length}`);

    return c.json({
      totalUsers: processedUsers,
      totalFixed,
      errors: allErrors
    });

  } catch (error) {
    console.error('❌ Error in fix all tax filings:', error);
    allErrors.push(error instanceof Error ? error.message : String(error));
    return c.json({
      totalUsers: processedUsers,
      totalFixed,
      errors: allErrors
    }, 500);
  }
});

export default fixTaxFilingsApp;