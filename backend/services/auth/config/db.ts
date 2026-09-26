import mongoose, { Query, Document } from "mongoose";

mongoose.plugin((schema) => {
  // Catch query-based operations (find, updateOne, deleteMany, etc.)
  const queryOps = /^(find|update|delete|count|aggregate)/i;
  schema.pre(queryOps, function (this: Query<unknown, unknown>) {
    const modelName = this.model ? this.model.modelName : "Unknown";
    const op = (this as any).op || "query";
    console.log(`[MongoDB Call] Operation: ${op} | Model: ${modelName}`);
  });

  // Catch document save/create operations
  schema.pre("save", function (this: Document) {
    const action = this.isNew ? "create" : "update";
    const modelName = (this.constructor as any)?.modelName || "Unknown";
    console.log(
      `[MongoDB Call] Operation: ${action} (save) | Model: ${modelName}`,
    );
  });
});

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};
