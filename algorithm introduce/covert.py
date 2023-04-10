import pypandoc

input_file = 'C:\\Users\\Lewis\\Desktop\\algorithm introduce\\algorithm.md'
output_file = '算法.docx'

# 调用pypandoc库进行转换
pypandoc.convert_file(input_file, 'docx', outputfile=output_file)
