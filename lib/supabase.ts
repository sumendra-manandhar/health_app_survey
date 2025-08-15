// import { createClient } from "@supabase/supabase-js";

// // Supabase configuration
// const supabaseUrl = "process.env.NEXT_PUBLIC_SUPABASE_URL";
// const supabaseAnonKey = "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY";

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables");
// }

// // Create Supabase client
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Database service class
// export class DatabaseService {
//   // Test database connection
//   static async testConnection() {
//     try {
//       const { data, error } = await supabase
//         .from("registrations")
//         .select("count", { count: "exact", head: true });

//       if (error) {
//         console.error("Database connection test failed:", error);
//         return { success: false, error: error.message };
//       }

//       return { success: true, count: data };
//     } catch (error) {
//       console.error("Database connection test error:", error);
//       return { success: false, error: String(error) };
//     }
//   }

//   // Registration operations
//   static async createRegistration(registrationData: any) {
//     try {
//       const { data, error } = await supabase
//         .from("registrations")
//         .insert([registrationData])
//         .select();

//       if (error) {
//         console.error("Error creating registration:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Registration creation error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   static async getRegistrations(filters?: any) {
//     try {
//       let query = supabase.from("registrations").select("*");

//       if (filters?.search) {
//         query = query.or(
//           `child_name.ilike.%${filters.search}%,contact_number.ilike.%${filters.search}%`
//         );
//       }

//       if (filters?.district) {
//         query = query.eq("district", filters.district);
//       }

//       if (filters?.limit) {
//         query = query.limit(filters.limit);
//       }

//       const { data, error } = await query.order("created_at", {
//         ascending: false,
//       });

//       if (error) {
//         console.error("Error fetching registrations:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Registration fetch error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   static async getRegistrationById(id: string) {
//     try {
//       const { data, error } = await supabase
//         .from("registrations")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching registration by ID:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Registration fetch by ID error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   static async updateRegistration(id: string, updates: any) {
//     try {
//       const { data, error } = await supabase
//         .from("registrations")
//         .update(updates)
//         .eq("id", id)
//         .select();

//       if (error) {
//         console.error("Error updating registration:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Registration update error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   static async deleteRegistration(id: string) {
//     try {
//       const { error } = await supabase
//         .from("registrations")
//         .delete()
//         .eq("id", id);

//       if (error) {
//         console.error("Error deleting registration:", error);
//         return { error };
//       }

//       return { error: null };
//     } catch (error) {
//       console.error("Registration deletion error:", error);
//       return { error: { message: String(error) } };
//     }
//   }

//   // Screening operations
//   static async createScreening(screeningData: any) {
//     try {
//       const { data, error } = await supabase
//         .from("screenings")
//         .insert([screeningData])
//         .select();

//       if (error) {
//         console.error("Error creating screening:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Screening creation error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   static async getScreenings(registrationId?: string) {
//     try {
//       let query = supabase.from("screenings").select("*");

//       if (registrationId) {
//         query = query.eq("patient_id", registrationId);
//       }

//       const { data, error } = await query.order("created_at", {
//         ascending: false,
//       });

//       if (error) {
//         console.error("Error fetching screenings:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Screening fetch error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   static async getScreeningsByRegistrationId(registrationId: string) {
//     try {
//       const { data, error } = await supabase
//         .from("screenings")
//         .select("*")
//         .eq("patient_id", registrationId)
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error fetching screenings by registration ID:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Screening fetch by registration ID error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   // Dose log operations
//   static async createDoseLog(doseLogData: any) {
//     try {
//       const { data, error } = await supabase
//         .from("dose_logs")
//         .insert([doseLogData])
//         .select();

//       if (error) {
//         console.error("Error creating dose log:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Dose log creation error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   static async getDoseLogs(registrationId?: string) {
//     try {
//       let query = supabase.from("dose_logs").select("*");

//       if (registrationId) {
//         query = query.eq("registration_id", registrationId);
//       }

//       const { data, error } = await query.order("created_at", {
//         ascending: false,
//       });

//       if (error) {
//         console.error("Error fetching dose logs:", error);
//         return { data: null, error };
//       }

//       return { data, error: null };
//     } catch (error) {
//       console.error("Dose log fetch error:", error);
//       return { data: null, error: { message: String(error) } };
//     }
//   }

//   // Statistics
//   static async getStatistics() {
//     try {
//       const [registrationsResult, screeningsResult, doseLogsResult] =
//         await Promise.all([
//           supabase
//             .from("registrations")
//             .select("count", { count: "exact", head: true }),
//           supabase
//             .from("screenings")
//             .select("count", { count: "exact", head: true }),
//           supabase
//             .from("dose_logs")
//             .select("count", { count: "exact", head: true }),
//         ]);

//       return {
//         totalRegistrations: registrationsResult.count || 0,
//         totalScreenings: screeningsResult.count || 0,
//         totalDoseLogs: doseLogsResult.count || 0,
//       };
//     } catch (error) {
//       console.error("Statistics fetch error:", error);
//       return {
//         totalRegistrations: 0,
//         totalScreenings: 0,
//         totalDoseLogs: 0,
//       };
//     }
//   }

//   // Sync operations
//   static async syncLocalData(localData: any[]) {
//     try {
//       let synced = 0;
//       const errors: any[] = [];

//       for (const item of localData) {
//         try {
//           const { error } = await this.createRegistration(item);
//           if (error) {
//             errors.push({ item, error: error.message });
//           } else {
//             synced++;
//           }
//         } catch (error) {
//           errors.push({ item, error: String(error) });
//         }
//       }

//       return {
//         success: true,
//         synced,
//         errors,
//       };
//     } catch (error) {
//       console.error("Sync error:", error);
//       return {
//         success: false,
//         synced: 0,
//         errors: [{ error: String(error) }],
//       };
//     }
//   }
// }
