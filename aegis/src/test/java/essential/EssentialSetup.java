package essential;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class EssentialSetup {

	public static void main(String[] args) throws InterruptedException {

		WebDriver driver=new ChromeDriver();
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
		
		driver.get("https://app.aegishrms.com/sign-in");
		
		try {

			// login
			driver.findElement(By.name("email")).sendKeys("automationscripts@gmail.com");
			driver.findElement(By.name("password")).sendKeys("Pass@123");
			Thread.sleep(2000);
			driver.findElement(By.xpath("//button[text()='Login']")).click();
			System.out.println("Admin Login done successfully");

			driver.findElement(By.xpath("//button[text()='Go To Organisation']")).click();
			driver.findElement(By.xpath("(//button[text()='Setup'])[1]")).click();
			System.out.println("------------------------------------------------");


			// Manage roles checkbox
			driver.findElement(By.xpath("(//input[@type='checkbox'])[1]")).click();
			driver.findElement(By.xpath("(//input[@type='checkbox'])[2]")).click();
			driver.findElement(By.xpath("(//input[@type='checkbox'])[3]")).click();
			driver.findElement(By.xpath("(//input[@type='checkbox'])[4]")).click();
			driver.findElement(By.xpath("(//input[@type='checkbox'])[5]")).click();
			driver.findElement(By.xpath("(//input[@type='checkbox'])[6]")).click();
			driver.findElement(By.xpath("(//input[@type='checkbox'])[7]")).click();
			driver.findElement(By.xpath("(//input[@type='checkbox'])[8]")).click();
			driver.findElement(By.xpath("//button[text()='Submit']")).click();
			Thread.sleep(3000);
			System.out.println("Added Roles successfully");

			// Leaves creation
			driver.findElement(By.xpath("//h1[text()='Leaves']")).click();
			driver.findElement(By.xpath("//button[text()='Add Leave']")).click();
			driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys("Casual leave"+Keys.ENTER);
			driver.findElement(By.name("count")).sendKeys("6");
			driver.findElement(By.xpath("//button[text()='Submit']")).click();
			Thread.sleep(2000);
			driver.findElement(By.xpath("//button[text()='Add Leave']")).click();
			driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys("Sick leave"+Keys.ENTER);
			driver.findElement(By.name("count")).sendKeys("4");
			driver.findElement(By.xpath("//button[text()='Submit']")).click();
			Thread.sleep(3000);
			System.out.println("Added Leaves data successfully");

			// Adding location
			driver.findElement(By.xpath("//h1[text()='Location']")).click();
			driver.findElement(By.xpath("//button[text()='Add Location']")).click();
			driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys("north america" + Keys.ENTER);
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys("united states" + Keys.ENTER);
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//input[@type='text'])[4]"))
					.sendKeys("california" + Keys.ENTER + Keys.TAB + "los angeles" + Keys.ARROW_DOWN + Keys.ENTER + Keys.TAB
							+ "Los Angeles" + Keys.TAB + "002541" + Keys.TAB + "Hollywood");
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//button[text()='Add Location'])[2]")).click();
			Thread.sleep(3000);
			System.out.println("Added Location successfully");

			// Adding public holidays
			driver.findElement(By.xpath("//h1[text()='Public Holidays']")).click();
			driver.findElement(By.xpath("//button[text()='Add Holiday']")).click();
			driver.findElement(By.name("holidayName")).sendKeys("Christmas");
			driver.findElement(By.name("holidayDate")).sendKeys("12/25/2024");
			driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys("optional" + Keys.ENTER);
			driver.findElement(By.xpath("(//input[@role='combobox'])[3]")).click();
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//input[@role='combobox'])[3]")).sendKeys("los"+Keys.ARROW_DOWN);
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//input[@role='combobox'])[3]")).sendKeys(Keys.ENTER);
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//button[text()='Add Holiday'])[2]")).click();
			Thread.sleep(3000);
			System.out.println("Added Public holidays successfully");

			// Adding employment type
			driver.findElement(By.xpath("//h1[text()='Employment']")).click();
			driver.findElement(By.xpath("//button[text()='Add Employment']")).click();
			driver.findElement(By.name("title")).sendKeys("Full Time");
			driver.findElement(By.xpath("//button[text()='Submit']")).click();
			Thread.sleep(3000);
			System.out.println("Added Employment type successfully");

			driver.navigate().refresh();
			Thread.sleep(4000);
			
			// Adding Salary Template
			driver.findElement(By.xpath("//h1[text()='Salary Template']")).click();
			driver.findElement(By.xpath("//button[text()='Add salary template']")).click();
			driver.findElement(By.name("name")).sendKeys("Full Time Salary");
			driver.findElement(By.xpath("(//input[@role='combobox'])[2]")).click();
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//input[@role='combobox'])[2]")).sendKeys(Keys.ARROW_DOWN);
			Thread.sleep(2000);
			driver.findElement(By.xpath("(//input[@role='combobox'])[2]")).sendKeys(Keys.ENTER);
			driver.findElement(By.xpath("(//input[@type='text'])[4]"))
					.sendKeys("basic" + Keys.ENTER + "hra" + Keys.ENTER + "da" + Keys.ENTER + "special" + Keys.ENTER);
			driver.findElement(By.xpath("(//input[@type='text'])[5]"))
					.sendKeys("pf" + Keys.ENTER + "esic" + Keys.ENTER + "tds" + Keys.ENTER + "tax" + Keys.ENTER);
			driver.findElement(By.xpath("//button[text()='submit']")).click();
			Thread.sleep(3000);
			System.out.println("Added Salary Template successfully");

			// Adding designation
			driver.findElement(By.xpath("//h1[text()='Designation']")).click();
			driver.findElement(By.xpath("//button[text()='Add Designation']")).click();
			driver.findElement(By.name("designationName")).sendKeys("Employee");
			driver.findElement(By.name("designationId")).sendKeys("E-0026");
			driver.findElement(By.xpath("(//button[text()='Add Designation'])[2]")).click();
			Thread.sleep(3000);
			System.out.println("Added Designation successfully");

			// Adding week off
			driver.findElement(By.xpath("//h1[text()='Weekly Off']")).click();
			driver.findElement(By.xpath("//button[text()='Add Days']")).click();
			driver.findElement(By.xpath("(//div[@role='button'])[1]")).click();
			driver.findElement(By.xpath("//button[text()='Submit']")).click();
			Thread.sleep(3000);
			System.out.println("Added Weekly off day successfully");

//			// Adding salary computation day
//			driver.findElement(By.xpath("//h1[text()='Salary Computation Day']")).click();
//			driver.findElement(By.xpath("//button[text()='Add Compute Day']")).click();
//			driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys("first" + Keys.ARROW_DOWN + Keys.ENTER);
//			driver.findElement(By.xpath("//button[text()='Submit']")).click();
//			Thread.sleep(3000);
//			System.out.println("Added Salary computation day successfully");

			// Adding Pf and ESIC details
			driver.findElement(By.xpath("//h1[text()='PF & ESIC Norms Calculation']")).click();
			driver.findElement(By.name("EPF")).sendKeys("12");
			driver.findElement(By.name("EPS")).sendKeys("12");
			driver.findElement(By.name("ECP")).sendKeys("0.75");
			driver.findElement(By.name("ECS")).sendKeys("3.25");
			driver.findElement(By.xpath("//button[text()='submit']")).click();
			Thread.sleep(3000);
			System.out.println("Added PF and ESIC details successfully");
			System.out.println("------------------------------------------------");

			// Logout
			Thread.sleep(2000);
			driver.findElement(By.id("basic-button")).click();
			Thread.sleep(2000);
			driver.findElement(By.xpath("//div[text()=' Log out']")).click();
			System.out.println("Admin Logout done successfully");

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		Thread.sleep(3000);
		driver.quit();
		
	}
	
}
