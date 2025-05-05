package basic;
 
import java.io.IOException;

import java.time.Duration;

import org.openqa.selenium.By;

import org.openqa.selenium.WebDriver;

import org.openqa.selenium.WebElement;

import org.testng.annotations.AfterClass;

import org.testng.annotations.BeforeClass;

import org.testng.annotations.Test;

import essential.BaseDriverSetup;

public class AdvanceSalary

{

	public static WebDriver driver;	

	@BeforeClass

	public void preCondition() throws IOException

	{   

		System.out.println("<---Automation Script For Advance Salary Start--->");

	    driver=BaseDriverSetup.getDriver();
		System.out.println("<---Automation Script For Loan Management Start--->");
	//	String browser = "edge";
		String url = "https://app.aegishrms.com/sign-in";
//		if(browser.equalsIgnoreCase("chrome"))
//		{
//			driver = new ChromeDriver();
//		}
//		else if(browser.equalsIgnoreCase("edge"))   
//		{
//			driver = new EdgeDriver();
//		}  
//		else   
//		{
//			driver = new ChromeDriver();
//		} 	
		System.out.println("<-----Chrome Browser Is Launched------>");
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
		driver.get(url);
		System.out.println("<--- Web Application URL Is Entered--->");


	}

	@Test 

	public void advanceSalary() throws InterruptedException

	{ 

		Login("emp1@gmail.com","Pass@123");

		System.out.println("<---Employee Login Into Application--->");

		employeeAdvanceSalaryApplication();

		System.out.println("<---Employee Advance Salary Application--->");

		AdvanceSalaryForm();

		System.out.println("<---Advance Salary Form Submission");

		Logout();

		System.out.println("<---Employee Logout From Application--->");

		Login("hr@hmail.com","Pass@123");

		System.out.println("<--- HR Login Into Application--->");	

		Hr_AdvanceSalaryApprovel();

		System.out.println("<---Hr Approvel For Advance Salary--->");

	}

	@AfterClass 

	public void postCondition() throws InterruptedException 

	{

		Thread.sleep(2000); 

		driver.quit(); 

	}  

	//<----------- User Defined Methods ----------->\\

	// 1] Elements For Login

	public void Login(String Email, String Password) throws InterruptedException

	{

		driver.findElement(By.id("email")).sendKeys(Email);

		driver.findElement(By.id("password")).sendKeys(Password);

	    driver.findElement(By.xpath("//button[text()='Login']")).click();

	    Thread.sleep(2000);

	}

	// 2] Elements For Logout

	public void Logout() throws InterruptedException

	{

		Thread.sleep(1000);

		driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='PersonIcon'])[2]")).click();

		Thread.sleep(1000);  

		driver.findElement(By.xpath("//div[contains(text(),' Log out')]")).click();

	}

	//3] Elements For Advance Salary Application

	public void employeeAdvanceSalaryApplication() throws InterruptedException

	{

		Thread.sleep(3000);

		driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='MenuIcon'])")).click();

	    Thread.sleep(1000);

	    driver.findElement(By.xpath("//h1[text()='Payroll']")).click();

	    Thread.sleep(500);

	    driver.findElement(By.xpath("//h1[text()='Advance Salary']")).click();

	    driver.findElement(By.xpath("//button[text()='Apply For Advance Salary']")).click();

	    Thread.sleep(500);

	}  

	// 4] Elements For Advance Salary Form

	public void AdvanceSalaryForm() throws InterruptedException

	{

		WebElement date = driver.findElement(By.id(":r3:"));

		date.click();

		 Thread.sleep(500);

		date.sendKeys("05012025");

		driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys("1");

		Thread.sleep(1000);

		driver.findElement(By.xpath("//input[@type='checkbox']")).click();

		 Thread.sleep(1000);

		driver.findElement(By.xpath("//button[text()='Submit']")).click();

		Thread.sleep(1000);

	}

	//5] Elements For HR Advance Salary Approvel

	public void Hr_AdvanceSalaryApprovel() throws InterruptedException

	{  

		Thread.sleep(1000);

		driver.findElement(By.xpath("//*[local-name()='svg' and @data-testid='NotificationsIcon']")).click();

		Thread.sleep(1000); 

		driver.findElement(By.xpath("//span[text()='Advance Salary']")).click();

		Thread.sleep(1000);

		driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='PersonIcon'])[3]")).click();

		Thread.sleep(1000);

		driver.findElement(By.xpath("//button[text()='Accept']")).click();

	}

}
 
 