namespace CardTest.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ini2 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.ActiveUsers", "UserName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ActiveUsers", "UserName", c => c.String());
        }
    }
}
