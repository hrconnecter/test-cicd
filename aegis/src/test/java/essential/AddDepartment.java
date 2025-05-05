package essential;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class AddDepartment {

    private WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = BaseDriverSetup.getDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
        driver.get("https://app.aegishrms.com");
        System.out.println("=========================================================");
        System.out.println("▶️ ADD DEPARTMENT AND DELETE DEPARTMENT");
    }

    @Test
	public void addDepartment() throws InterruptedException {
		try {
			login("automationscripts@gmail.com", "Pass@123");
			System.out.println("Login successful");

			navigateToAddDepartment();

			// Add Department - First Page
			driver.findElement(By.name("dept_name")).sendKeys("Billing");
			selectDropdownOption("lake");
			driver.findElement(By.xpath("//button[text()='Next']")).click();

			// Add Department - Second Page
			driver.findElement(By.name("dept_id")).sendKeys("Billing-002");
			driver.findElement(By.name("dept_cost_center_id")).sendKeys("002");
			driver.findElement(By.xpath("//button[text()='Next']")).click();
			driver.findElement(By.xpath("//button[text()='Submit']")).click();
			System.out.println("Department added successfully");

			// Delete Department
			deleteDepartment();
			System.out.println("Department deleted successfully");

			logout();
			System.out.println("Logout successful");

			System.out.println("=========================================================");
			System.out.println("✅ ADD DEPARTMENT AND DELETE DEPARTMENT- PASSED");
		} catch (Exception e) {
			System.out.println("❌ ADD DEPARTMENT AND DELETE DEPARTMENT- FAILED");
			System.out.println("🔍 Error Message: " + e.getMessage());
			e.printStackTrace();
            Assert.fail("Test failed due to exception: " + e.getMessage());

		}
	}

    private void login(String email, String password) throws InterruptedException {
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        Thread.sleep(2000); // Simulate realistic delays
        driver.findElement(By.xpath("//button[text()='Login']")).click();
    }

    private void logout() throws InterruptedException {
        Thread.sleep(3000);
        driver.findElement(By.id("basic-button")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//div[text()=' Log out']")).click();
    }

    private void navigateToAddDepartment() throws InterruptedException {
        driver.findElement(By.linkText("Go To Organisation")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("(//button[text()='Setup'])[1]")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Department']")).click();
        driver.findElement(By.linkText("Add Department")).click();
    }

    private void selectDropdownOption( String value) throws InterruptedException {
    	Thread.sleep(2000);
        driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(value + Keys.ENTER);
    }
    
    public void deleteDepartment() throws InterruptedException {
    	driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='DeleteOutlineIcon'])[2]")).click();
    	Thread.sleep(2000);
        driver.findElement(By.xpath("//button[text()='Delete']")).click();
    }

    @AfterClass
    public void teardown() throws InterruptedException {
        if (driver != null) {
            Thread.sleep(3000);
            System.out.println("=========================================================");
            driver.quit();
        }
    }
}
