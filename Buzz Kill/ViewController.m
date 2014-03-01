#import "ViewController.h"

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    self.webview.dataDetectorTypes = UIDataDetectorTypeLink;
    [self.webview loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:@"/Web"]]]];
}

- (void)viewDidLayoutSubviews
{
    CGRect webviewFrame = CGRectMake(0, 0, self.view.frame.size.height, self.view.frame.size.height / 1.386);
    webviewFrame.origin.y = self.view.frame.size.width - webviewFrame.size.height;
    self.webview.frame = webviewFrame;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
