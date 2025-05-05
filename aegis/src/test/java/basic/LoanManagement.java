package basic;
import java.io.IOException;
import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import essential.BaseDriverSetup;
public class LoanManagement                                                                            
{    
	public static WebDriver driver;	
	@BeforeClass
	public void preCondition() throws IOException
	{   
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
	public void basicOrganisationLoanManagement() throws InterruptedException
	{
		Login("noble@gmail.com", "Pass@123");   
		System.out.println("<---Super Admin Login--->");
		loanManagementSetup("Bike Loan","0","100000","1");
		System.out.println("<---Loan Management Setup--->");	
		Logout(); 
		System.out.print("<---Super Admin Logout--->");
		Login("sahil@basic.com","Pass@123"); 
		System.out.print("<---Employee Login--->");
		employeeLoanApply();
		System.out.println("<---Employee Apply For Loan--->");
		loanApplicationForm("2000", "2");
		System.out.println("<---Loan Application Form--->");
		Logout();
		System.out.println("<---Employee Logout--->");
		Login("hr@basic.com","Pass@123");
		System.out.println("<---Hr User Login--->"); 	
		hr_Loan_Approvel();
		System.out.println("<---Hr Loan Approvel--->");
		Logout();
		System.out.println("<---Hr User Logout--->");
		Login("noble@gmail.com", "Pass@123");   
		System.out.println("<---Super Admin Login--->"); 
		superAdminRemoveLoanType();
		System.out.println("<---Super Admin Remove Loan Type-->");
		Logout(); 
		System.out.print("<---Super Admin Logout--->");	
	}  
	@AfterClass
	public void postConditions() throws InterruptedException
	{
		closeServer();
	}
	 //<-------------------------User defined Methods------------------------>\\
 
	public void loanManagementSetup(String loanName,String minLoanAmount,String maxLoanAmount,String intrest) throws InterruptedException
	{
		Thread.sleep(2000);
		driver.findElement(By.xpath("//button[text()='Go To Organisation']")).click();
		System.out.println("<---Clicked on Organisation button --->");
		Thread.sleep(2000);
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
		WebElement setupBtn = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("(//button[text()='Setup'])[2]")));
		setupBtn.click();

	//	driver.findElement(By.xpath("(//button[text()='Setup'])[2]")).click();
		driver.findElement(By.xpath("//h1[text()='Loan Management']")).click();
		driver.findElement(By.xpath("//button[text()='Add Loan Type']")).click();
		driver.findElement(By.name("loanName")).sendKeys(loanName);
		driver.findElement(By.name("loanValue")).sendKeys(minLoanAmount);
		driver.findElement(By.name("maxLoanValue")).sendKeys(maxLoanAmount);
		driver.findElement(By.name("rateOfInterest")).sendKeys(intrest);
		Thread.sleep(1000); 
		driver.findElement(By.xpath("//button[text()='Submit']")).click(); 
	}
	public void employeeLoanApply() throws InterruptedException
	{
		Thread.sleep(2000);
	    driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='MenuIcon'])")).click();
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//h1[text()='Payroll']")).click();
	    Thread.sleep(1000);
	    driver.findElement(By.xpath("(//h1[text()='Loan Management'])[1]")).click();
	    driver.findElement(By.xpath("//button[text()='Apply For Loan.']")).click();
	}
	public void loanApplicationForm(String LoanAmount,String EMI) throws InterruptedException
	{
		Thread.sleep(2000);
		driver.findElement(By.xpath("//div[@role='combobox']")).click();
		driver.findElement(By.xpath("//li[text()='Bike Loan']")).click();
		Thread.sleep(1000);
		driver.findElement(By.id("outlined-adornment-password")).sendKeys(LoanAmount);
		Thread.sleep(1000);
		driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(EMI);
		Thread.sleep(1000);
		driver.findElement(By.xpath("//button[text()='Submit']")).click();
		Thread.sleep(1000);
	} 
	public void hr_Loan_Approvel() throws InterruptedException   
	{
		Thread.sleep(2000);
		driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='NotificationsIcon'])")).click();
		Thread.sleep(500);
		driver.findElement(By.xpath("//span[text()='Loan']")).click();
		Thread.sleep(500);
		driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='PersonIcon'])[2]")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("//button[text()='Accept']")).click();
		Thread.sleep(500);
	} 
	public void superAdminRemoveLoanType() throws InterruptedException
	{
		Thread.sleep(1000);
	    driver.findElement(By.xpath("//button[text()='Go To Organisation']")).click();
	    driver.findElement(By.xpath("(//button[text()='Setup'])[2]")).click();
		Thread.sleep(1000);
		driver.findElement(By.xpath("(//h1[text()='Loan Management'])[1]")).click();
		Thread.sleep(500);
		driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='DeleteOutlineIcon'])")).click();
		Thread.sleep(500);
		driver.findElement(By.xpath("//button[text()='Delete']")).click();
	}
	public void closeServer() throws InterruptedException
	{
		Thread.sleep(2000);
		//driver.quit(); 
	}
	public void Login(String Email, String Password) throws InterruptedException
	{
		driver.findElement(By.id("email")).sendKeys(Email);
		driver.findElement(By.id("password")).sendKeys(Password);
		driver.findElement(By.xpath("//button[text()='Login']")).click();
	    Thread.sleep(1000);
	}
	public void Logout() throws InterruptedException
	{
		Thread.sleep(1000);
		driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='PersonIcon'])")).click();
		Thread.sleep(500);  
		driver.findElement(By.xpath("//div[contains(text(),' Log out')]")).click();
	}
}