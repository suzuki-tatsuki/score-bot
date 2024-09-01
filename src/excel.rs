use calamine::{open_workbook, Reader, Xlsx, Data};

pub fn read_excel() {
    let xl_book_path = "data.xlsx";
    let mut workbook: Xlsx<_> = open_workbook(xl_book_path).expect("cannot open xl book");

    if let Ok(range) = workbook.worksheet_range("Sheet1") {
        for row in 1..5 {
            let cell_value = range.get_value((row as u32, 8));
            match cell_value {
                    Some(Data::Float(cell_value)) => {
                        let value_float: f64 = *cell_value;
                        println!("{:?}", value_float);
                    },
                    _ => println!("Not a float value or empty"),
                }
        }
    } else {
        eprintln!("Error: Cannot find 'sheet name'");
    }
}
