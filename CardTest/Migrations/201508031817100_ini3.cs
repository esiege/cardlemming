namespace CardTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ini3 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ActiveUsers", "SessionId", c => c.Single());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ActiveUsers", "SessionId", c => c.String());
        }
    }
}
