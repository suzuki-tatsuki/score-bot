use calamine::{open_workbook, Reader, Xlsx};

pub fn read_excel() {
    let xl_book_path = "data.xlsx";
    let mut workbook: Xlsx<_> = open_workbook(xl_book_path).expect("cannot open xl book");

    if let Ok(range) = workbook.worksheet_range("Sheet1") {
        for row in 1..5 {
            let cell_value = range.get_value((row as u32, 8));
            println!("{:?}", cell_value);
        }
    } else {
        eprintln!("Error: Cannot find 'sheet name'");
    }
}
